// to keep things organized, controller files are used to store the functionality associated with the various routes

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleError } from "../error.js";

// next is an api middleware, every time sign up is finished, next happens... next
export const signup = async (req, res, next) => {
    try {
        // for authentication, a hashed password is necessary
        // this creates a salt (randomly generated value) with (10) rounds
        const salt = bcrypt.genSaltSync(10);
        //this combines the salt with the stored password in the database
        const hash = bcrypt.hashSync(req.body.password, salt);
        // this will put this newly created user data into the database, according to the schema in the User.js model
        // ... takes whatever is present and the password stored in the .body of the database, and pass in the hash
        const newUser = new User({ ...req.body, password: hash });
        // creating a new user is time consuming so async/await is used
        // and the newUser data is saved onto mongoDB
        await newUser.save();
        // this is to create a new cookie using jwt
        // mongoDB will generate a unique id number, which is used here as "_id", in order to create a token. Bring in JWT from the .env in order to add an extra bit of security to the id
        const token = jwt.sign({id: newUser._id}, process.env.JWT);

        // don't want to have the password being passed around in the json file, so it needs to be destructured using the mongoDB tool _doc which also gets rid of unnecessary data and just sends the info as a doc  
        // ._doc can be used to extract a selection values that are in the variable, and we can specify that the password is taken out while the rest of the data (othersData) is passed on to the .json as a parameter
        const { password, ...othersData } = newUser._doc;

        //once a new user is created, this token is used to send back to the browser as a cookie
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(othersData);
    } catch (err) {
        next(err);
    }
};

// add the ability to sign into a previously made user (add a new request on postman)
// first we find the user in our db, check if the password is right, if it is correct, attach a token to them (so the browser knows it is the same user)
export const signin = async (req, res, next) => {
  try {
    // first, find the user (we only want user name and password, not email) using User.findOne (which is a mongoDB method)
    //(body is passed on from the form's input)
    const user = await User.findOne({ username: req.body.username });
    // if no user is found, handle the error
    if (!user) return next(handleError(404, "user not found"));
    // if a user is found, bring in the password and check if it is the same by first using bcrypt to decode the previously hashed password
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    // if the password is not correct
    if (!isCorrect) return next(handleError(400, "Wrong Password"));
    // finally, if the password does match, a token is created (just like before when signing up)
    const token = jwt.sign({id: user._id}, process.env.JWT);
    // also need to take out the password once again so that it is not accidentally passed on
    const {password, ...othersData} = user._doc;
    // and send a cookie as before
    res
    .cookie("access_token", token, {httpOnly: true})
    .status(200)
    .json(othersData);
  } catch (err) {
    next(err);
  }
};