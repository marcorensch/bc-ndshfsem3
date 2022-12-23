import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import ApiError from "../model/ApiError.mjs";
import {loginValidator, registrationValidator} from "../middleware/formValidator.mjs";

import UserController from "../controller/UserController.mjs";
import formSanitizer from "../middleware/formSanitizer.mjs";
import jwt from "jsonwebtoken";

const router = express.Router();


// Do work here

router.get('/', (req, res) => {
    res.json(users);
});

router.post('/register', formSanitizer, registrationValidator, async (req, res) => {
    console.log("User data received: ", req.user);

    const userController = new UserController();
    const result = await userController.registerUser(req.user);

    if(result.success && result.data.affectedRows === 1) {
        res.status(201).json({
            message: "User registered successfully"
        });
    }else{
        let errData = {};
        if(result.data.code === "ER_DUP_ENTRY"){
            const column = result.data.message.split("for key")[1].split("'")[1];
            errData = new ApiError('u-321', "Username already exists", column);
        }else{
            errData = new ApiError('e-999', "Unknown Error");
            console.error("Unknown error while registering User:", result.data);
        }
        res.status(409).json(errData);
    }
});
router.post('/login', formSanitizer, loginValidator, async (req, res) => {
    console.log("User data received & access granted: ", req.user);

    jwt.sign({user: req.user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}, (err, token) => {
        if(err) return res.status(500).json(new ApiError('e-999', "Unknown Error"));
        res.json({accessToken:token});
    });

    // res.status(200).json({msg: "Thanks for logging in", user: req.user});

});

export default router;

