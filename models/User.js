import mongoose from "mongoose";

//initialize the mongo database structure with mongoose.Schema
const UserSchema = new mongoose.Schema(
    {
        //every user will have a username, email, password, profilePicture, followers, following, description
        username: {
            // it will be a string
            type: String,
            // it will be required
            required: true,
            // make sure that every usename is unique/no duplicates
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            // string because it will be a URL for the pic's location
            type: String,
        },
        followers: {
            // using an array in order to store an ID of each follower
            type: Array,
            defaultValue: [],
        },
        following: {
            // using an array in order to store an ID of everyone the user is following
            type: Array,
            defaultValue: [],
        },
        description: {
            type: String
        },
        profilePicture: {
            type: String
        },
    }, 
    // mongoDB feature that can create a timestamp, will use it to note when the user was created
    {timestamps: true}
);

//export this so that it can be used any time we need to create or reference a user
export default mongoose.model("User", UserSchema);