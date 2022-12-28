import DatabaseConnector from "../model/DatabaseConnector.mjs";
import jwt from "jsonwebtoken";

class TokenController {
    databaseConnector;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async checkToken(token) {
        return await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }

    async createToken(userId) {
        return await jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.JWT_TOKEN_VALIDITY});
    }

    async createRefreshToken(userId) {
        return await jwt.sign({id: userId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.JWT_REFRESH_TOKEN_VALIDITY});
    }

    async storeToken(refreshToken, userId) {
        const sql = "INSERT INTO access_tokens (token, user_id) VALUES (?,?)";
        return await this.databaseConnector.query(sql, [refreshToken, userId]);
    }

    async deleteToken(token) {
        const sql = "DELETE FROM access_tokens WHERE token=?";
        return await this.databaseConnector.query(sql, [token]);
    }

    async checkRefreshToken(refreshToken) {
        let verify;
        try {
            verify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return false;
                return user;
            });
        } catch (error) {
            console.log(error);
            return false;
        }
        console.log("RefreshToken Verify: " , verify);
        const sql = "SELECT COUNT(token) AS count FROM access_tokens WHERE token=?";
        const res = await this.databaseConnector.query(sql, [refreshToken]);
        if(res.data[0].count > 0) return verify;
        return false;
    }
}

export default TokenController;