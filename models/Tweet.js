import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema(
  {
    // who is the user that made the tweet
    userId: {
      type: String,
      required: true,
    },
    // text content of the tweet
    description: {
      type: String,
      required: true,
      max: 280,
    },
    //who liked the tweets and how many likes in total
    likes: {
      type: Array,
      defaultValue: [],
    },
  },
  // timestamp when posted
  { timestamps: true }
);

export default mongoose.model('Tweet', TweetSchema);