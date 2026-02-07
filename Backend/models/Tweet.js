import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    tweetId: { type: String }, // Twitter's ID
    postedAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }, // For future tracking
    retweets: { type: Number, default: 0 } // For future tracking
}, { timestamps: true });

export default mongoose.model("Tweet", TweetSchema);
