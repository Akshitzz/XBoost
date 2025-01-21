import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TwitterApi } from 'twitter-api-v2';
import schedule from 'node-schedule';

// Initialize dotenv
config();

// Check if required environment variables are set

const requiredEnvVars = [
    'GEMINI_API_KEY',
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET',
    'TWITTER_BEARER_TOKEN',
    'TWITTER_ACCESS_TOKEN',
    'TWITTER_ACCESS_SECRET',
  ];
  
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      console.error(`Error: Missing environment variable ${varName}`);
      process.exit(1);
    }
  }


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

// Function to generate a tweet from AI
async function generateTweet() {
    try {
      const prompts = [
        // General/Humorous (20-25 year old tone)
        "Write a short, humorous tweet about the struggles of being a developer, from the perspective of a 20-something-year-old. Keep it under 280 characters. Don't include any hashtags. Add some relatable humor.",
        "Generate a tweet about a funny situation a developer might face while working with AI tools, in the voice of a 20-something-year-old. Keep it under 280 characters. Don't include any hashtags. Make it lighthearted.",
        "Create a tweet about a common tech problem, but said with the frustration of a 20-year-old. Keep it under 280 characters. Don't include any hashtags. Use mild language",
        "Write a tweet about a typical coding session, but from the perspective of a 20-year-old. Keep it under 280 characters. Don't include any hashtags. Make it relatable.",
       "Write a short tweet about that feeling when you finally fix a bug. Keep it under 280 characters. Don't include any hashtags, use slang and mild language",
        
         // Hindi Mix
        "Generate a tweet in Hindi about the struggles of learning a new programming language. Keep it under 280 characters. Don't include any hashtags. Use a casual tone, like a 20 year old would say it.",
        "Write a tweet in a mix of Hindi and English about the joys and pains of debugging. Keep it under 280 characters. Don't include any hashtags. Make it funny and relatable.",
        "Create a tweet mixing Hindi and English about a funny incident that happened during an interview. Keep it under 280 characters. Don't include any hashtags. Be light hearted",
        "Write a tweet in Hindi about an AI tool that blew your mind. Keep it under 280 characters. Don't include any hashtags. Use a very chill tone.",
      "Write a tweet in a mix of Hindi and English about that feeling when you solve a bug. Keep it under 280 characters. Don't include any hashtags. Be very chill and relatable",
    
        // Interview Experiences
        "Generate a tweet about a funny or awkward moment from a recent tech interview, from a 20-something's perspective. Keep it under 280 characters. Don't include any hashtags. Make it relatable.",
        "Write a tweet describing the feeling after an interview. Keep it under 280 characters. Don't include any hashtags. Make it relatable",
         "Create a tweet using mild language and humor to describe the struggles of tech interviews. Keep it under 280 characters. Don't include any hashtags",
          "Write a tweet in a funny way about those coding tests that happen during tech interviews. Keep it under 280 characters. Don't include any hashtags",
        "Write a tweet describing a common misconception about coding interviews. Keep it under 280 characters. Don't include any hashtags. Use mild language and a funny tone",
    
    
        // AI Tool Focused
        "Write a tweet about a cool new AI tool that blew your mind. Keep it under 280 characters. Don't include any hashtags. Be genuinely amazed.",
        "Create a tweet roasting a popular AI tool and talking about its flaws. Keep it under 280 characters. Don't include any hashtags. Be sarcastic but humorous.",
        "Generate a tweet about how a AI tool made your developer life so much easier. Keep it under 280 characters. Don't include any hashtags. Be genuinely happy about it.",
         "Write a tweet about how AI is going to change the way we develop software. Keep it under 280 characters. Don't include any hashtags. Try to be very insightful.",
         "Write a tweet about why AI tools are so important for a student. Keep it under 280 characters. Don't include any hashtags. Make it relateable for students",
    
        // Mild Gaali/Frustration
         "Generate a tweet expressing frustration about debugging a particularly annoying bug, use mild language. Keep it under 280 characters. Don't include any hashtags.",
        "Write a tweet about the struggle of understanding a complicated piece of code, use mild language. Keep it under 280 characters. Don't include any hashtags.",
        "Create a tweet about a specific tool that is particularly bad, use mild language. Keep it under 280 characters. Don't include any hashtags. Be sarcastic",
        "Write a tweet about the frustration when a library is not working as expected, use mild language. Keep it under 280 characters. Don't include any hashtags. Be humorous",
        "Write a tweet about what you do when you are completely stuck while coding, use mild language. Keep it under 280 characters. Don't include any hashtags",
    
    
        // Technical Stuff
        "Write a short technical tweet explaining one important concept in a very simple way. Keep it under 280 characters. Don't include any hashtags. Make it easy to understand",
        "Create a tweet that asks other developers what are some of their favorite resources. Keep it under 280 characters. Don't include any hashtags. Be genuine and curious.",
          "Generate a tweet that talks about how important it is to keep learning and improving your skills. Keep it under 280 characters. Don't include any hashtags. Be genuine and encouraging",
          "Write a tweet about how important open source is for the developer community. Keep it under 280 characters. Don't include any hashtags. Be genuine and encouraging",
        "Write a tweet about what you are currently learning and if it has helped you. Keep it under 280 characters. Don't include any hashtags. Share your experiences",
    ];
    
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        const result = await model.generateContent(randomPrompt);
        const tweetText = result.response.text();
        return tweetText;
    
      } catch (error) {
        console.error("Error generating tweet:", error);
        return null;
      }
}

//hindi, interview experience, more on AI, replies to big accounts, 

// Function to post a tweet to Twitter
async function postTweet(tweetText) {
    if(!tweetText){
        console.error("No tweet text provided, cannot post to twitter")
        return;
    }
  try {
    const response = await rwClient.v2.tweet(tweetText);
    console.log("Tweet posted:", response.data.id);
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw error; // rethrow error to trigger retry logic
  }
}


// Main function to generate and post a tweet
async function main() {
    const tweetText = await generateTweet();
    console.log("Generated tweet:", tweetText);
  
    if (tweetText) {
        try{
            await postTweet(tweetText);
        } catch (error) {
            console.error("Error posting tweet:", error);
            console.log("Retrying to post tweet after 30 seconds");
            setTimeout(async () => {
                try {
                    await postTweet(tweetText);
                  } catch (retryError) {
                    console.error("Retry failed:", retryError);
                  }
            }, 30000);
        }
    }
}

// Immediately run the main function on start
(async () => {
    console.log("Running initial tweet generation and posting on startup");
    await main();
})();

// Schedule the job to run every hour
const job = schedule.scheduleJob('0 * * * *', async () => {
  const now = new Date();
  const formattedDate = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  });
  console.log('Running scheduled tweet generation and posting at:', formattedDate);

  try {
    await main();
  } catch (error) {
    console.error("An error occurred during tweet generation or posting:", error);
    // Do nothing and wait for the next scheduled interval
  }

});


console.log("Scheduled tweet job to run every hour.");


// Keep the script running indefinitely
setInterval(() => {
    // This does nothing, but keeps the script alive
}, 10000);