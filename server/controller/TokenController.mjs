import DatabaseConnector from "../model/DatabaseConnector.mjs";
import jwt from "jsonwebtoken";

class TokenController {
    databaseConnector;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async createToken(userId) {
        return await jwt.sign({id: userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
    }

    async createRefreshToken(userId) {
        return await jwt.sign({id: userId}, process.env.REFRESH_TOKEN_SECRET);
    }

    async storeToken(token, userId) {
        const sql = "INSERT INTO tokens (token, user_id) VALUES (?,?)";
        return await this.databaseConnector.query(sql, [token, userId]);
    }

    async verifyToken(req, res) {}

    async deleteToken(token) {
        const sql = "DELETE FROM tokens WHERE token=?";
        return await this.databaseConnector.query(sql, [token]);
    }
}

export default TokenController;