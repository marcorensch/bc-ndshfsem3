import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import ApiError from "../model/ApiError.mjs";
import {loginValidator, registrationValidator} from "../middleware/formValidator.mjs";

import UserController from "../controller/UserController.mjs";
import formSanitizer from "../middleware/formSanitizer.mjs";
import TokenController from "../controller/TokenController.mjs";

const router = express.Router();


// Do work here

router.get('/', (req, res) => {
    res.json(users);
});

router.post('/token', async (req, res) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.status(401).json(new ApiError('u-341', "Refresh token is missing"));
    const tokenController = new TokenController();
    const userId = await tokenController.checkRefreshToken(refreshToken);

    if(!userId) return res.status(403).json(new ApiError('u-342', "Refresh token is invalid"));

    res.status(200).json(userId);

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
        let errData;
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

    const tokenController = new TokenController();
    const token = await tokenController.createToken(req.user.id);
    const refreshToken = await tokenController.createRefreshToken(req.user.id);
    await tokenController.storeToken(refreshToken);

    if(!token || !refreshToken){
        res.status(500).json(new ApiError('e-999', "Unknown Error"));
        return;
    }

    res.status(200).json({ message: "User logged in successfully", token, refreshToken });
});

export default router;

