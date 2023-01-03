import jwt from "jsonwebtoken";

import TokenHelper from "../helper/TokenHelper.mjs";
import ApiError from "../model/ApiError.mjs";
import UserHelper from "../helper/UserHelper.mjs";

async function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const refreshToken = req.headers['RefreshToken'] || req.headers['refreshtoken'] || req.headers['refreshToken'] || req.body['refreshToken'] || req.body['RefreshToken'] || req.body['refreshtoken'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    const tokenHelper = new TokenHelper();
    const userHelper = new UserHelper();

    try {
        const {id} = await tokenHelper.checkToken(token);
        req.user = await userHelper.getUserById(id);
    }catch(err) {
        if(err instanceof jwt.TokenExpiredError && refreshToken) {
            const refreshTokenContent = await tokenHelper.checkRefreshToken(refreshToken);
            if(!refreshTokenContent || !refreshTokenContent.id) return res.status(403).json(new ApiError('u-342'));
            req.user = await userHelper.getUserById(refreshTokenContent.id);
            req.token = await tokenHelper.createToken(req.user);
        }else{
            return res.status(403).json(new ApiError('u-342'));
        }
    }
    next();
}

async function authenticateUser(req, res, next) {

    console.log("AUTHENTICATE USER");
    console.log(req.user)

    const userHelper = new UserHelper();


    next();
}

export {authenticateToken, authenticateUser};