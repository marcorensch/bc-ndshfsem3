import * as dotenv from 'dotenv';
dotenv.config();

import express from "express";
import ApiError from "../model/ApiError.mjs";
import {loginValidator, registrationValidator} from "../middleware/formValidator.mjs";
import UserHelper from "../helper/UserHelper.mjs";
import { formSanitizer, loginSanitizer } from "../middleware/formSanitizer.mjs";
import TokenHelper from "../helper/TokenHelper.mjs";
import TransportObject from "../model/TransportObject.mjs";

const router = express.Router();

router.post('/token', async (req, res) => {
    const tokenHelper = new TokenHelper();
    const userHelper = new UserHelper();

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if(refreshToken == null) return res.status(401).json(new ApiError('u-341'));

    const refreshTokenData = await tokenHelper.checkRefreshToken(refreshToken);
    if(!refreshTokenData || !refreshTokenData.id) return res.status(403).json(new ApiError('u-342'));

    const user = await userHelper.getUserById(refreshTokenData.id);
    const token = await tokenHelper.createToken(user);

    res.status(201).json({token});
});
router.post('/register', formSanitizer, registrationValidator, async (req, res) => {
    const userHelper = new UserHelper();
    const result = await userHelper.registerUser(req.user);

    if(result.success && result.data.affectedRows === 1) {
        const transportObject = new TransportObject().setSuccess(true).setMessage("User registered successfully");
        res.status(201).json(transportObject);
    }else{
        if(result.data.code === "ER_DUP_ENTRY"){
            const column = result.data.message.split("for key")[1].split("'")[1];
            res.status(409).json(new ApiError('u-321', column));
        }else{
            console.error("Unknown error while registering User:", result);
            res.status(409).json(new ApiError('e-999'));
        }
    }
});
router.post('/login', loginSanitizer, loginValidator, async (req, res) => {
    const tokenHelper = new TokenHelper();
    const token = await tokenHelper.createToken(req.user);
    const refreshToken = await tokenHelper.createRefreshToken(req.user.id);

    try {
        await tokenHelper.storeToken(refreshToken, req.user.id);
    }catch (error) {
        console.error("Error while storing refresh token:", error);
        return res.status(500).json(new ApiError('e-999'));
    }

    if(!token || !refreshToken) return res.status(500).json(new ApiError('e-999'));

    const transportObject = new TransportObject()
        .setSuccess(true)
        .setPayload({token, refreshToken, user:req.user})
        .setMessage("User logged in successfully");

    res.status(200).json(transportObject);
});

router.delete('/logout', async (req, res) => {
    const tokenHelper = new TokenHelper();
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    const refreshToken = authHeader && authHeader.split(' ')[1];
    if(refreshToken == null) return res.status(401).json(new ApiError('u-341'));

    const result = await tokenHelper.deleteToken(refreshToken);
    if(result.success && result.data.affectedRows === 1) {
        const transportObject = new TransportObject().setSuccess(true).setMessage("User logged out successfully");
        res.status(200).json(transportObject);
    }else{
        console.log("Error while logging out user:", result.data);
        res.status(500).json(new ApiError('e-999'));
    }
});

export default router;

