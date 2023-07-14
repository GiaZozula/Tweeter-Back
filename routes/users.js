//this file will have all of the user's routes, using express
import express from "express";

//import the functionality from user.js
import {getUser, update, deleteUser, follow, unfollow} from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js";

//bring in the router from express
const router = express.Router();

// when putting data you don't need to find, so just id
// you also want to put middleware that verifies the user to be updated
// you should only be able to update your currently signed-in user 
// Update User
router.put('/:id', verifyToken, update);

//making a get request to test the router (all the middleware will have a request and a response)
// /find/:id is the parameter that will allow us to find a user
// Get User
router.get('/find/:id', getUser);

// Delete User
router.delete("/:id", verifyToken, deleteUser);

// Follow User
router.put("/follow/:id", verifyToken, follow);

// Unfollow User
router.put("/unfollow/:id", verifyToken, unfollow);

//export all of the routers in this file
export default router;