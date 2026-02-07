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
import authMiddleware from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/xboost")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

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
        const { url, codeVerifier, state } = oauthClient.generateOAuth2AuthLink(
            `${process.env.SERVER_URL}/api/auth/twitter/callback`,
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
        tweetData = req.body;
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

        // Schedule future tweets for this user
        scheduleTweet(tweetData, user._id);

    } catch (error) {
        console.error("Error receiving tweet data:", error);
        res.status(500).json({ error: "Failed to process tweet data" });
    }
});

// Function to generate tweet
const generateTweet = async (data) => {
    try {
        const prompt = `
            Generate a tweet promoting a product:
            - Username: ${data.username}
            - Product Name: ${data.productName}
            - Product Details: ${data.productDetails}
            - Product Features: ${data.productFeatures}
            - Problem Solved: ${data.productProblem}
            - Marketing Focus: ${data.productMarketing}
            Please keep the tweet under 280 characters.
        `;

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

// Schedule tweets based on the number of tweets per day
const scheduleTweet = (data, userId) => {
    if (!data || !data.tweetCount) return;

    const tweetsPerDay = parseInt(data.tweetCount, 10);
    const intervalInHours = Math.floor(24 / tweetsPerDay);

    console.log(`Scheduling ${tweetsPerDay} tweets per day for User ID: ${userId}`);

    // Note: detailed cron storage is better for production, this is in-memory per server restart
    cron.schedule(`0 */${intervalInHours} * * *`, () => {
        console.log("Generating and posting a scheduled tweet...");
        generateAndPostTweet(data, userId);
    });
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
