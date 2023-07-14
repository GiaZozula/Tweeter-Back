import { handleError } from "../error.js";
import User from "../models/User.js";
import Tweet from "../models/Tweet.js";


export const getUser = async(req, res, next) => {
    try {
        // finding user by id because in the users.js route, id is defined by the params in the get request
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch(err) {
        next(err);
    }
};

export const update = async (req, res, next) => {
    // this has already been checked but one more check just in case to verify that the id is correct
    if(req.params.id === req.user.id){
        try {
            //findByIdAndUpdate is a mongoDB function that speeds things up
             const updatedUser = await User.findByIdAndUpdate(req.params.id, 
                {
                //passing a method called set in order to overwrite everything that we have in the specified location (here, req.body but could be anything, for ex. username etc.)
                $set: req.body, 
                }, 
                {
                new: true,
                }
            );

            res.status(200).json(updatedUser);
        } catch(err) {
            next(err);
        }
  } else {
    return next(handleError(403, "You can only update your own account"));
  };
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      await Tweet.remove({ userId: req.params.id });

      res.status(200).json("User delete");
    } catch (err) {
      next(err);
    }
  } else {
    return next(handleError(403, "You can only delete your own account"));
  }
};

export const follow = async (req, res, next) => {
    try {
        //get the user we want to follow (user2)
        //first need the id from their profile under params
        const user = await User.findById(req.params.id);
        //get the current logged in user (user1)
        const currentUser = await User.findById(req.body.id);
        
        
        //add user1 to user2's followers list
        //if user1 is not already on the followers list
        if(!user.followers.includes(req.body.id)) {
            await user.updateOne({
                //push into user2's followers array the id of user1
                $push: {followers: req.body.id},
            })
            //add user2 to user1's following array
            await currentUser.updateOne({
                $push: {following: req.params.id},
            });
        } else {
            res.status(403).json("you already follow this user");
        }
        res.status(200).json("following the user");
    } catch (err) {
      next(err);
    }
};

export const unfollow = async (req, res, next) => {
  try {
    //get the user to unfollow's id (user2)
    const user = await User.findById(req.params.id);
    //get the current logged in user (user1)
    const currentUser = await User.findById(req.body.id);

    //if user1 is following user2
    if (currentUser.following.includes(req.params.id)) {
      await user.updateOne({
        //we pull user2's followers and delete user1's id
        $pull: { followers: req.body.id },
      });
      //pull user2's id from user1's following list
      await currentUser.updateOne({
        $pull: { following: req.params.id },
      });
    } else {
      res.status(403).json("you are not following this user");
    }
    res.status(200).json("unfollowing the user");
  } catch (err) {
    next(err);
  }
};