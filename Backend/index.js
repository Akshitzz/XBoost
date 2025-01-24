import dotenv from "dotenv";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import cron from "node-cron";

dotenv.config();

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

// Store tweet data from user input
let tweetData = null;

app.post("/api/generate-tweet", async (req, res) => {
    try {
        tweetData = req.body;  

        res.json({ message: "Tweet data received. Scheduling job..." });

        scheduleTweet(tweetData); 
    } catch (error) {
        console.error("Error receiving tweet data:", error);
        res.status(500).json({ error: "Failed to process tweet data" });
    }
});

// Function to generate and post a tweet
const generateAndPostTweet = async (data) => {
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
    const tweetText = result.response.text();

        const response = await rwClient.v2.tweet(tweetText);
        console.log("Tweet posted successfully:", response.data.id);
    } catch (error) {
        console.error("Error generating or posting tweet:", error);
    }
};

// Schedule tweets based on the number of tweets per day
const scheduleTweet = (data) => {
    if (!data || !data.tweetCount) return;

    const tweetsPerDay = parseInt(data.tweetCount, 10);
    const intervalInHours = Math.floor(24 / tweetsPerDay);

    console.log(`Scheduling ${tweetsPerDay} tweets per day.`);

    cron.schedule(`0 */${intervalInHours} * * *`, () => {
        console.log("Generating and posting a scheduled tweet...");
        generateAndPostTweet(data);
    });
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
