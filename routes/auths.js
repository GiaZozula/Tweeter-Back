// everything in the routes folder is connected to the controllers (where functionality is stored)
// use this route for where users will be signed up and authenticated

import express from "express";
import { signup, signin } from "../controllers/auth.js";

// initialize the router
const router = express.Router();

// for signing a user up, a post request is used
router.post("/signup", signup);
// for a signing in as a user, another post request
router.post("/signin", signin);

//export the router
export default router;