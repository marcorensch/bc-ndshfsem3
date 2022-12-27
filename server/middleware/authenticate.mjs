import * as jwt from "jsonwebtoken";
import TokenController from "../controller/TokenController.mjs";
import ApiError from "../model/ApiError.mjs";

async function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    const tokenController = new TokenController();
    try {
        const user = await tokenController.checkToken(token);
        req.user = user;
    }catch(err) {
        if(err.TokenExpiredError === jwt.TokenExpiredError && req.body.refreshToken) {
            const user = await tokenController.checkRefreshToken(req.body.refreshToken);
            if(!user) return res.status(403).json(new ApiError('u-342', "Refresh token is invalid"));
            req.user = user;
            req.token = await tokenController.createToken(user.id);
        }else{
            return res.status(403).json(new ApiError('u-342', "Refresh token is invalid"));
        }
    }
    next();
}



export {authenticateToken};