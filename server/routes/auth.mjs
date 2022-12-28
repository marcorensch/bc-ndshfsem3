import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import ApiError from "../model/ApiError.mjs";
import {loginValidator, registrationValidator} from "../middleware/formValidator.mjs";

import UserController from "../controller/UserController.mjs";
import { formSanitizer, loginSanitizer } from "../middleware/formSanitizer.mjs";
import TokenController from "../controller/TokenController.mjs";

const router = express.Router();


// Do work here

router.get('/', (req, res) => {
    res.json(users);
});

router.post('/token', async (req, res) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if(refreshToken == null) return res.status(401).json(new ApiError('u-341'));
    const tokenController = new TokenController();
    const user = await tokenController.checkRefreshToken(refreshToken);
    if(!user) return res.status(403).json(new ApiError('u-342'));
    const token = await tokenController.createToken(user.id);
    res.status(201).json({token});
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
            errData = new ApiError('u-321', column);
        }else{
            errData = new ApiError('e-999');
            console.error("Unknown error while registering User:", result);
        }
        res.status(409).json(errData);
    }
});
router.post('/login', loginSanitizer, loginValidator, async (req, res) => {
    console.log("User data received & access granted: ", req.user);

    const tokenController = new TokenController();
    const token = await tokenController.createToken(req.user.id);
    const refreshToken = await tokenController.createRefreshToken(req.user.id);
    try {
        await tokenController.storeToken(refreshToken, req.user.id);
    }catch (e) {
        console.error("Error while storing refresh token:", e);
        return res.status(500).json(new ApiError('e-999'));
    }

    if(!token || !refreshToken){
        res.status(500).json(new ApiError('e-999'));
        return;
    }

    res.status(200).json({ message: "User logged in successfully", token, refreshToken });
});

router.delete('/logout', async (req, res) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if(refreshToken == null) return res.status(401).json(new ApiError('u-341'));
    const tokenController = new TokenController();
    const result = await tokenController.deleteToken(refreshToken);
    if(result.success && result.data.affectedRows === 1) {
        res.status(200).json({ message: "User logged out successfully" });
    }else{
        console.log("Error while logging out user:", result.data);
        res.status(500).json(new ApiError('e-999'));
    }
});

export default router;

