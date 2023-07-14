import Tweet from "../models/Tweet.js";
import { handleError } from "../error.js";
import User from "../models/User.js";

export const createTweet = async (req, res, next) => {
  //grabbing the Tweet from the schema, passing the body (will basically be a description)
  const newTweet = new Tweet(req.body);
  try {
    // await saves the tweet and passing the saved tweet on
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    handleError(500, err);
  }
};

export const deleteTweet = async (req, res, next) => {
  //first we want to find the tweet using the tweet's id
  try {
    const tweet = await Tweet.findById(req.params.id);
    // if owner of the tweet === user who is logged in
    if (tweet.userId === req.body.id) {
      // delete tweet
      await tweet.deleteOne();
      res.status(200).json("tweet has been deleted");
    } else {
      // need to log in
      handleError(500, err);
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const likeOrUnlike = async (req, res, next) => {
  try {
    //first grab the tweet by id
    const tweet = await Tweet.findById(req.params.id);
    //if the tweet's likes does not include this user
    if (!tweet.likes.includes(req.body.id)) {
      await tweet.updateOne({
        $push: { likes: req.body.id },
      });
      res.status(200).json("tweet has been liked");
    } else {
      await tweet.updateOne({
        $pull: { likes: req.body.id },
      });
      res.status(200).json("tweet has been unliked");
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const getAllTweets = async (req, res, next) => {
  try {
    //we grab the user and see who they are following to get their tweets
    const currentUser = await User.findById(req.params.id);

    const userTweets = await Tweet.find({ userId: currentUser._id });
    //using a promise.all to get all of the users being followed's tweets, and then map through all of these users
    const followersTweets = await Promise.all(
      currentUser.following.map((followerId) => {
        //and then find all of their tweets by using all of the followerId
        return Tweet.find({ userId: followerId });
      })
    );
    //concat the user's tweets with the followers tweets
    res.status(200).json(userTweets.concat(...followersTweets));
  } catch (err) {
    handleError(500, err);
  }
};

export const getUserTweets = async (req, res, next) => {
  try {
    //find all of the user's tweets, and then use the sort method to put the most recent tweet at the top
    const userTweets = await Tweet.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(userTweets);
  } catch (err) {
    handleError(500, err);
  }
};

export const getExploreTweets = async (req, res, next) => {
  try {
    //find all tweets that have been liked, and then sort through them and put the most liked tweet on the top
    const getExploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ likes: -1 });
    res.status(200).json(getExploreTweets);
  } catch (err) {
    handleError(500, err);
  }
};
