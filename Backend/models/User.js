import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    twitterAccessToken: { type: String },
    twitterRefreshToken: { type: String },
    twitterId: { type: String },
    twitterUsername: { type: String },
    tweetSchedule: {
        enabled: { type: Boolean, default: false },
        promptData: { type: Object },
        tweetsPerDay: { type: Number, default: 0 },
        lastPosted: { type: Date }
    }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
