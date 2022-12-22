import DatabaseConnector from "../model/DatabaseConnector.mjs";


class UserController {
    databaseConnector = null;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getAllUsers() {
        try {
            const sql = "SELECT id,firstname,lastname,username,email,status,created,usergroup FROM users";
            return await this.databaseConnector.query(sql, null);
        } catch (error) {
            console.log(error);
        }
    }

    async registerUser(user) {
        if(user.userGroup === null || user.userGroup === undefined) {
            user.userGroup = await this._getUserGroupIdByAlias("registered")
        }
        if(user.userGroup) {
            const sql = "INSERT INTO users (firstname, lastname, username, email, password, status, usergroup) VALUES (?,?,?,?,?,?,?)";
            const response = await this.databaseConnector.query(sql, [user.firstname, user.lastname, user.username, user.email, user.password, 1, user.userGroup]);
            return response;
        }else{
            console.log("Usergroup not found");
            return false;
        }
    }

    async _getUserGroupIdByAlias(groupAlias) {
        const sql = "SELECT id FROM usergroups WHERE alias=?";
        const result = await this.databaseConnector.query(sql, [groupAlias]);
        return result.data[0].id;
    }

    async getUserIdByUsername(username) {
        const sql = "SELECT id FROM users WHERE username=?";
        const result = await this.databaseConnector.query(sql, [username]);
        console.log(result);
        return result.data[0].id;
    }

    async getUserIdByEmail(email) {
        const sql = "SELECT id FROM users WHERE email=?";
        const result = await this.databaseConnector.query(sql, [email]);
        console.log(result);
        return result.data[0].id;
    }
}

export default UserController;