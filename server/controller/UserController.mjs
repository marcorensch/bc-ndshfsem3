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
        const groupId = await this._getUserGroupIdByAlias("registered");;
        if(groupId) {
            const sql = "INSERT INTO users (firstname, lastname, username, email, password, status, usergroup) VALUES (?,?,?,?,?,?,?)";
            const response = await this.databaseConnector.query(sql, [user.firstname, user.lastname, user.username, user.email, user.password, 1, groupId]);
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
}

export default UserController;