import DatabaseConnector from "../model/DatabaseConnector.mjs";
import UsergroupsHelper from "./UsergroupsHelper.mjs";
import User from "../model/User.mjs";


class UserHelper {
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
            try{
                const response = await this.databaseConnector.query(sql, [user.firstname, user.lastname, user.username, user.email, user.password, 1, user.userGroup]);
                return response;
            }catch (error) {
                throw error;
            }

        }else{
            console.log("Usergroup not found");
            return false;
        }
    }

    async getUsersGroupByUserId(userId) {
        const sql = "SELECT usergroup FROM users WHERE id=?";
        const result = await this.databaseConnector.query(sql, [userId]);
        return result.data[0].usergroup;
    }
    async _getUserGroupIdByAlias(groupAlias) {
        const sql = "SELECT id FROM usergroups WHERE alias=?";
        const result = await this.databaseConnector.query(sql, [groupAlias]);
        return result.data[0].id;
    }

    async getUserIdByUsername(username) {
        const sql = "SELECT id FROM users WHERE username=?";
        return await this.databaseConnector.query(sql, [username]);
    }

    async getUserByUsername(username) {
        const sql = "SELECT id,username,firstname,lastname,email,password FROM users WHERE username=?";
        const result = await this.databaseConnector.query(sql, [username]);
        if(result.data.length > 0) {
            const user = await this._buildUserObject(result.data[0]);
            return user;
        }
        return false;
    }

    async getUserIdByEmail(email) {
        const sql = "SELECT id FROM users WHERE email=?";
        const result = await this.databaseConnector.query(sql, [email]);
        if(result.data && result.data.length > 0) {
            const user = await this._buildUserObject(result.data[0]);
            return user.id;
        }
        return false;
    }

    async _buildUserObject(data) {
        const user = new User(data.firstname, data.lastname, data.username, data.email);
        user.id = data.id;
        user.status = data.status;
        user.userGroup = data.usergroup;
        if(data.password) user.password = data.password;
        user.isAdministrator = await this.isAdministrator(data.id);
        return user;
    }

    async deleteUserByUsername(username) {
        const sql = "DELETE FROM users WHERE username=?";
        return await this.databaseConnector.query(sql, [username]);
    }

    async getUserById(id) {
        const sql = "SELECT id,firstname,lastname,username,email,status,usergroup FROM users WHERE id=?";
        const result = await this.databaseConnector.query(sql, [id]);
        const user = await this._buildUserObject(result.data[0]);
        return user;
    }

    async isAdministrator(id) {
        const usersGroup = await this.getUsersGroupByUserId(id);
        const usergroupsHelper = new UsergroupsHelper();
        const usergroups = await usergroupsHelper.getAllUsergroups();
        const adminGroup = usergroups.find(group => group.alias === "administrator");
        if(usersGroup === adminGroup.id) return true;

        return false;
    }
}

export default UserHelper;