//whenever we log in, we wanna grab the token that was used during sign-in and verify that it matches with the user (especially when doing put requests)
//cookie-parser dependency was installed in order for the server to be able to access the browser's cookie (for the req.cookies.access_token)

import jwt from 'jsonwebtoken';
import {handleError} from "./error.js";

export const verifyToken = (req, res, next) => {
    //this token will be in the cookies (you can find it in the inspector under Application/Storage/Cookies in chrome)
    const token = req.cookies.access_token;
    // if there is no token, throw a 401 token error
    if(!token) return next(handleError(401, "You are not authenticated"));
    //if a token is found, then we have to make sure it is verified with the token of the user that is currently logged in
    jwt.verify(token, process.env.JWT, (err, user) => {
        if(err) return next(createError(403, "Token is invalid"));
        // if the user is verified, attach the user to the request with our browser for use on the frontend 
        //when building the frontend, we want to make sure that everytime we use the user it is coming from through this verification process
        req.user = user; 
        next();
    });
};