//~ node.js backend psuedocode ~
// technologies: react, redux, JWT (jsonwebtoken for cookies), node, mongodb, express, mongoose, postman, nodemon, dotenv, bcryptjs (password hash, so that a complete password isn't stored in the backend), cookie-parser (allows the express server to read cookies)
// basic set up: index.js file, routes folder, controllers folder, models folder (for all the data on MongoDB)
// index.js had the endpoint, once we hit this endpoint we will have access to several requests for the route (GET, POST,) etc.
// a file called "userRoutes.js" in the routes folder will contain all the different possible routes for that user endpoint
// that specific user (once we reach the routes folder) will have some functionality
// for example, when you do a GET request, it will set off a particular function
// this function will live in a file in the controllers folder to keep everything organized

//using nodemon to keep the server updated with every change (npm start instead of running node index.js in the console)

//added type: module to the package.json so that i can use import (ES6) instead of require
import express from "express";
// installed dotenv with -D (so it is a dev dependency)
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// bring in the userRoutes from the users.js 
import userRoutes from "./routes/users.js";
// bring in authRoutes from auth.js
import authRoutes from "./routes/auths.js"
// bring in the tweetRoutes from the tweets.js 
import tweetRoutes from "./routes/tweets.js";

// initializing the app with express
const app = express();

//initialize the config for dotenv so it can read what is in the ".env" file
dotenv.config();

//connect the application to mongoDB using mongoose and the initializing path in the .env file (a variable that i named MONGO) with the included password
const connect = () => {
    mongoose
      .connect(process.env.MONGO)
      //.then and catch are used to handle the promise, .catch if there is any problem with .then's promise going through
      .then(() => {
        console.log("connected to mongoDB database");
      })
      .catch((err) => {
        throw err;
      });
};

app.use(cookieParser());
// when a request goes through, it will hit the extension and find the following routes
// this is to define (for express) that the database will be json
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);

app.listen(8000, () => {
    connect();
    console.log('listening to port 8000')
});