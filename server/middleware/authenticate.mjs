import * as jwt from "jsonwebtoken";
import TokenHelper from "../helper/TokenHelper.mjs";
import ApiError from "../model/ApiError.mjs";
import UserHelper from "../helper/UserHelper.mjs";

async function authenticateToken (req, res, next) {
    // @ ToDo was ist wenn Auth Header fehlt?
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    const tokenHelper = new TokenHelper();
    const userHelper = new UserHelper();

    try {
        const {id} = await tokenHelper.checkToken(token);
        const user = userHelper.getUserById(id);
        req.user = user;
        next();
    }catch(err) {
        if(err.TokenExpiredError === jwt.TokenExpiredError && req.body.refreshToken) {
            const {id} = await tokenHelper.checkRefreshToken(req.body.refreshToken);
            if(!id) return res.status(403).json(new ApiError('u-342'));
            const user = userHelper.getUserById(id);
            req.token = await tokenHelper.createToken(user.id);
        }else{
            return res.status(403).json(new ApiError('u-342'));
        }
    }

}



export {authenticateToken};