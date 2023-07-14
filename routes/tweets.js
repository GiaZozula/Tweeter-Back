import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createTweet,
  deleteTweet,
  likeOrUnlike,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
} from "../controllers/tweet.js";
import { verify } from "jsonwebtoken";


const router = express.Router();

// create a tweet
router.post("/", verifyToken, createTweet);

// delete a tweet
// make sure we have the id of the tweet, verify the user, and delete
router.delete("/:id", verifyToken, deleteTweet);

//like or dislike a tweet
router.put("/:id/like", likeOrUnlike);

//get all timeline tweets (all tweets the signed in user has tweeted and all tweets from whoever that user is following)
router.get("/timeline/:id", getAllTweets);

// get user Tweets only
router.get("/user/all/:id", getUserTweets);

//explore
router.get("/explore", getExploreTweets);

export default router;