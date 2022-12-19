import DatabaseConnector from "../model/DatabaseConnector.mjs";


class UserController {
    constructor() {
        this.databaseConnector = new DatabaseConnector();
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
        const userGroup = await this._getUserGroupIdByAlias("registered");
        if(userGroup) {
            console.log("Usergroup: ", userGroup);
            const sql = "INSERT INTO users (firstname, lastname, username, email, password, status, usergroup) VALUES (?,?,?,?,?,?,?)";
            const response = await this.databaseConnector.query(sql, [user.firstname, user.lastname, user.username, user.email, user.password, 1, 3]);
            return response;
        }else{
            console.log("Usergroup not found");
            return false;
        }
    }

    async _getUserGroupIdByAlias(groupAlias) {
        const sql = "SELECT id FROM usergroups WHERE alias=?";
        return await this.databaseConnector.query(sql, [groupAlias]);
    }
}

export default UserController;