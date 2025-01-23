import dotenv from "dotenv"
import express from "express";
import { config } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TwitterApi } from "twitter-api-v2";

dotenv.config();
console.log(process.env.TWITTER_API_KEY);

const app = express();
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Twitter API client
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const rwClient = twitterClient.readWrite;

// Handle incoming requests from the frontend
app.post("/api/generate-tweet", async (req, res) => {
    try {
        const {
            username,
            productName,
            productDetails,
            productFeatures,
            productProblem,
            productMarketing,
            tweetCount,
        } = req.body;

        const prompt = `
            Generate a tweet promoting a product:
            - Username: ${username}
            - Product Name: ${productName}
            - Product Details: ${productDetails}
            - Product Features: ${productFeatures}
            - Problem Solved: ${productProblem}
            - Marketing Focus: ${productMarketing}
            - Number of tweets per day: ${tweetCount}
            Please keep the tweet under 280 characters.
        `;

        const result = await model.generateContent(prompt);
        const tweetText = result.response.text();

        //  Post the generated tweet to Twitter
        try {
            const response = await rwClient.v2.tweet(tweetText);
         console.log("Tweet posted successfully:", response.data.id);
        } catch (tweetError) {
            console.error("Error posting tweet:", tweetError);
        }

        res.json({ tweet: tweetText });
    } catch (error) {
        console.error("Error generating tweet:", error);
        res.status(500).json({ error: "Failed to generate tweet" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
