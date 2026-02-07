import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TwitterApi } from "twitter-api-v2";
import cron from "node-cron";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Tweet from "./models/Tweet.js";
import authMiddleware from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/xboost")
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit process with failure
    });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Initialize Twitter API client
const oauthClient = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
});

// Temporary store for OAuth state and verifier
const dbCache = new Map();

// Register Route
app.post("/api/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        // Generate JWT Token
        const token = jwt.sign(
            { id: savedUser._id, username: savedUser.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ token, user: { id: savedUser._id, username: savedUser.username, email: savedUser.email } });

    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Generate Twitter Auth Link
app.get("/api/auth/twitter", authMiddleware, async (req, res) => {
    try {
        const redirectUri = `${process.env.SERVER_URL}/api/auth/twitter/callback`;
        console.log("Generating OAuth Link with Redirect URI:", redirectUri);

        const { url, codeVerifier, state } = oauthClient.generateOAuth2AuthLink(
            redirectUri,
            { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
        );

        // Store verifier and user ID linked to state
        dbCache.set(state, { codeVerifier, userId: req.user.id });

        res.json({ url });
    } catch (error) {
        console.error("Error generating OAuth link:", error);
        res.status(500).json({ error: "Failed to generate auth link" });
    }
});

// Twitter Auth Callback
app.get("/api/auth/twitter/callback", async (req, res) => {
    const { state, code } = req.query;
    const session = dbCache.get(state);

    if (!state || !session || !code) {
        return res.status(400).send("Invalid state or code");
    }

    const { codeVerifier, userId } = session;

    try {
        const { client: loggedClient, accessToken, refreshToken } = await oauthClient.loginWithOAuth2({
            code,
            codeVerifier,
            redirectUri: `${process.env.SERVER_URL}/api/auth/twitter/callback`,
        });

        const { data: userObject } = await loggedClient.v2.me();

        // Update user in DB with tokens
        await User.findByIdAndUpdate(userId, {
            twitterAccessToken: accessToken,
            twitterRefreshToken: refreshToken,
            twitterId: userObject.id,
            twitterUsername: userObject.username
        });

        dbCache.delete(state);

        // Redirect back to frontend dashboard
        res.redirect(`${process.env.CLIENT_URL}/getstarted`);

    } catch (error) {
        console.error("Error during Twitter login:", error);
        res.status(500).send("Authentication failed");
    }
});


app.get("/api/user/status", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ isConnected: !!user.twitterAccessToken, username: user.twitterUsername });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/generate-tweet", authMiddleware, async (req, res) => {
    try {
        const tweetData = req.body;
        const user = await User.findById(req.user.id);

        if (!user || !user.twitterAccessToken) {
            return res.status(401).json({ error: "Please connect your X account first." });
        }

        // Generate the first tweet immediately
        const generatedTweet = await generateTweet(tweetData);

        if (!generatedTweet) {
            return res.status(500).json({ error: "Failed to generate tweet" });
        }

        // Send the generated tweet back to the frontend
        res.json({
            message: "Tweet generated and job scheduled successfully",
            tweet: generatedTweet
        });

        // Save schedule to database for persistence
        user.tweetSchedule = {
            enabled: true,
            promptData: tweetData,
            tweetsPerDay: parseInt(tweetData.tweetCount, 10),
            lastPosted: new Date()
        };
        await user.save();

    } catch (error) {
        console.error("Error receiving tweet data:", error);
        res.status(500).json({ error: "Failed to process tweet data" });
    }
});

// Endpoint to trigger scheduled tweets (Call this via external cron every 10-15 mins)
app.get("/api/cron/run", async (req, res) => {
    try {
        console.log("Running Cron Job...");
        const users = await User.find({ "tweetSchedule.enabled": true });

        let tweetsPosted = 0;
        let engagements = 0;

        for (const user of users) {
            const { tweetsPerDay, lastPosted, promptData } = user.tweetSchedule;

            // Enforce daily limit (Max 6)
            const effectiveTweetsPerDay = Math.min(tweetsPerDay, 6);
            if (!effectiveTweetsPerDay || effectiveTweetsPerDay <= 0) continue;

            const intervalMs = (24 * 60 * 60 * 1000) / effectiveTweetsPerDay;
            const timeSinceLastPost = new Date() - new Date(lastPosted);

            // 1. Check if it's time to Tweet
            if (timeSinceLastPost >= intervalMs) {
                console.log(`Posting scheduled tweet for ${user.username}...`);

                // Pass 'true' for 'variety' to request different angles
                const tweetText = await generateTweet(promptData, true);
                if (tweetText) {
                    const tweetId = await postTweet(tweetText, user._id);
                    if (tweetId) {
                        user.tweetSchedule.lastPosted = new Date();
                        await user.save();
                        tweetsPosted++;
                    }
                }
            }

            // 2. Community Engagement (Independent of tweeting schedule, e.g., runs every cron hit)
            // We limit this to avoid rate limits (e.g., probability check or specific interval)
            if (Math.random() < 0.3) { // 30% chance per cron run to attempt engagement
                const didEngage = await engageWithCommunity(user);
                if (didEngage) engagements++;
            }
        }

        res.json({ status: "success", tweetsPosted, engagements });

    } catch (error) {
        console.error("Cron Job Error:", error);
        res.status(500).json({ error: "Cron execution failed" });
    }
});

// Community Engagement Function
const engageWithCommunity = async (user) => {
    try {
        const client = await getUserClient(user);
        const { productName, productMarketing } = user.tweetSchedule.promptData || {};

        if (!productName) return false;

        // Note: Twitter API v2 Free Tier has very limited Search capabilities. 
        // We attempt to search for keywords. If 403 (Forbidden), we catch it.
        const query = `#${productName.replace(/\s/g, '')} OR ${productMarketing ? productMarketing.split(' ')[0] : 'tech'}`;

        console.log(`Attempting to search tweets for engagement: ${query}`);

        // Search for recent tweets (might fail on Free Tier)
        const searchResult = await client.v2.search(query, { max_results: 10 });

        if (searchResult.data && searchResult.data.data.length > 0) {
            // Find a tweet to like (that isn't our own)
            const tweets = searchResult.data.data.filter(t => t.author_id !== user.twitterId);

            if (tweets.length > 0) {
                const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];

                await client.v2.like(user.twitterId, randomTweet.id);
                console.log(`Liked tweet ${randomTweet.id} from autonomous agent`);
                return true;
            }
        }
    } catch (error) {
        // Suppress errors for engagement as it's likely due to tier limits
        console.log(`Engagement skipped/failed (likely API limits): ${error.message}`);
    }
    return false;
};

// Function to generate tweet
const generateTweet = async (data, variety = false) => {
    try {
        let prompt = `
            Generate a tweet promoting a product:
            - Username: ${data.username}
            - Product Name: ${data.productName}
            - Product Details: ${data.productDetails}
            - Product Features: ${data.productFeatures}
            - Problem Solved: ${data.productProblem}
            - Marketing Focus: ${data.productMarketing}
            Please keep the tweet under 280 characters.
        `;

        if (variety) {
            const angles = [
                "Focus on a specific feature.",
                "Ask a question to the audience.",
                "Share a quick tip related to the problem solved.",
                "Use a motivational tone.",
                "Be humorous and witty."
            ];
            const randomAngle = angles[Math.floor(Math.random() * angles.length)];
            prompt += `\nMake this tweet unique by taking this angle: ${randomAngle}`;
        }

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating tweet:", error);
        return null;
    }
};

// Function to get a valid Twitter client for a user (handles refreshing)
const getUserClient = async (user) => {
    const client = new TwitterApi({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
    });

    if (user.twitterRefreshToken) {
        try {
            // Refresh token logic would go here if needed, or use the stored access token
            const { accessToken, refreshToken, client: refreshedClient } = await client.refreshOAuth2Token(user.twitterRefreshToken);

            // Update DB with new tokens
            user.twitterAccessToken = accessToken;
            user.twitterRefreshToken = refreshToken;
            await user.save();

            return refreshedClient;
        } catch (error) {
            console.log("Token refresh failed or not needed, trying current token");
            // Fallback to existing token if refresh fails or isn't strictly needed immediately (logic can be improved)
            return new TwitterApi(user.twitterAccessToken);
        }
    }
    return new TwitterApi(user.twitterAccessToken);
};

// Dashboard Data Endpoint
app.get("/api/dashboard", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Fetch local XBoost stats
        const totalTweetsGenerated = await Tweet.countDocuments({ userId: user._id });
        const recentTweets = await Tweet.find({ userId: user._id }).sort({ postedAt: -1 }).limit(10);

        let twitterStats = {};

        // Fetch live Twitter stats if connected
        if (user.twitterAccessToken) {
            try {
                const client = await getUserClient(user);
                // Fetch user logic with metrics
                const me = await client.v2.me({ "user.fields": ["public_metrics", "profile_image_url"] });
                twitterStats = {
                    followers: me.data.public_metrics?.followers_count || 0,
                    following: me.data.public_metrics?.following_count || 0,
                    totalTweets: me.data.public_metrics?.tweet_count || 0,
                    profileImage: me.data.profile_image_url
                };
            } catch (err) {
                console.error("Error fetching Twitter stats:", err);
            }
        }

        res.json({
            user: { username: user.username, email: user.email },
            stats: {
                totalGenerated: totalTweetsGenerated,
                ...twitterStats
            },
            recentTweets,
            schedule: user.tweetSchedule // Send schedule info as well
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const postTweet = async (tweetText, userId) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.twitterAccessToken) return;

        // Use the refresh logic to get a valid client
        const client = new TwitterApi({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
        });

        // Simple refresh flow for robustness
        const { client: userClient, accessToken, refreshToken } = await client.refreshOAuth2Token(user.twitterRefreshToken);

        // Update tokens
        user.twitterAccessToken = accessToken;
        user.twitterRefreshToken = refreshToken;
        await user.save();

        const response = await userClient.v2.tweet(tweetText);
        console.log("Tweet posted successfully for user:", user.username, "ID:", response.data.id);

        // SAVE TWEET TO DB
        await Tweet.create({
            userId: user._id,
            content: tweetText,
            tweetId: response.data.id,
            postedAt: new Date()
        });

        return response.data.id;
    } catch (error) {
        console.error("Error posting tweet:", error);
    }
};

const generateAndPostTweet = async (data, userId) => {
    const tweetText = await generateTweet(data);
    if (tweetText) {
        await postTweet(tweetText, userId);
    }
};

// Kept this for compatibility if needed, but the /api/cron/run is the main driver now
const scheduleTweet = (data, userId) => {
    // Legacy in-memory scheduler - deprecated in favor of DB persistence
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
