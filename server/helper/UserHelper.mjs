import DatabaseConnector from "../model/DatabaseConnector.mjs";
import UsergroupsHelper from "./UsergroupsHelper.mjs";
import User from "../model/User.mjs";
import QuestionHelper from "./QuestionHelper.mjs";


class UserHelper {
    databaseConnector = null;
    constructor(connectionData) {
        this.connectionData = connectionData;
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getAllUsers() {
        try {
            let sql = "SELECT u.id,u.firstname,u.lastname,u.username,u.email,u.status,u.created_at, u.usergroup, ug.title as roletitle FROM users u";
            sql += " LEFT JOIN usergroups ug ON u.usergroup=ug.id";
            sql += " ORDER BY created_at DESC";
            const res = await this.databaseConnector.query(sql, null);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    async registerUser(user) {
        if(user.usergroup === null || user.usergroup === undefined) {
            user.usergroup = await this._getUserGroupIdByAlias("registered")
        }
        if(user.usergroup) {
            const sql = "INSERT INTO users (firstname, lastname, username, email, password, status, usergroup) VALUES (?,?,?,?,?,?,?)";
            try{
                return await this.databaseConnector.query(sql, [user.firstname, user.lastname, user.username, user.email, user.password, 1, user.usergroup]);
            }catch (error) {
                throw error;
            }

        }else{
            console.log("Usergroup not found");
            return false;
        }
    }

    async updateUserData(user) {
        const data = [user.firstname, user.lastname, user.email, user.username, user.usergroup];
        let sql = "UPDATE users SET firstname=?, lastname=?, email=?, username=?, usergroup=?"
        if(user.password) {
            sql += ", password=?";
            data.push(user.password);
        }
        sql += " WHERE id=?";
        data.push(user.id);
        try{
            const res = await this.databaseConnector.query(sql, data);
            return res.data.affectedRows > 0;
        }catch (error) {
            console.log(error);
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
        const sql = "SELECT id,username,firstname,lastname,email,password,usergroup FROM users WHERE username=?";
        const result = await this.databaseConnector.query(sql, [username]);
        if(result.data.length > 0) {
            return await this._buildUserObject(result.data[0]);
        }
        return false;
    }

    async getUserIdByEmail(email) {
        const sql = "SELECT id FROM users WHERE email=?";
        return await this.databaseConnector.query(sql, [email]);
    }

    async _buildUserObject(data) {
        const user = new User(data.firstname, data.lastname, data.username, data.email);
        user.id = data.id;
        user.status = data.status;
        user.usergroup = data.usergroup;
        if(data.password) user.password = data.password;
        user.isadministrator = await this.isAdministrator(user);
        return user;
    }

    async deleteUserByUsername(username) {
        const sql = "DELETE FROM users WHERE username=?";
        return await this.databaseConnector.query(sql, [username]);
    }

    async deleteUserById(userId) {
        const sql = "DELETE FROM users WHERE id=?";
        return await this.databaseConnector.query(sql, [userId]);
    }

    async getUserById(id) {
        const sql = "SELECT id,firstname,lastname,username,email,status,usergroup FROM users WHERE id=?";
        const result = await this.databaseConnector.query(sql, [id]);
        return await this._buildUserObject(result.data[0]);
    }

    async isAdministrator(user) {
        const usergroupsHelper = new UsergroupsHelper(this.connectionData);
        const usergroups = await usergroupsHelper.getAllUsergroups();
        const adminGroup = usergroups.find(group => group.alias === "administrator");

        return user.usergroup === adminGroup.id;
    }

    async setUsergroupForUserWithName(user, usergroupAlias) {
        const usergroupsHelper = new UsergroupsHelper(this.connectionData);
        const usergroups = await usergroupsHelper.getAllUsergroups();
        const usergroup = usergroups.find(group => group.alias === usergroupAlias);

        if(usergroup) {
            const sql = "UPDATE users SET usergroup=? WHERE id=?";
            return await this.databaseConnector.query(sql, [usergroup.id, user.id]);
        }
        return false;
    }

    async getRecentActivities(userId, limit){
        const questionHelper = new QuestionHelper(this.connectionData);
        const sql = "SELECT * FROM (SELECT id, content, created_at, 'question' as type FROM questions WHERE created_by=? UNION SELECT id, content, created_at, 'answer' as type FROM answers WHERE created_by=?) as activities ORDER BY created_at DESC LIMIT ? ";
        try{
            const data = await this.databaseConnector.query(sql, [userId, userId, limit]);
            const questions = data.data.filter(activity => activity.type === "question");
            let answers = data.data.filter(activity => activity.type === "answer");
            for (const answer of answers) {
                answer.question = await questionHelper.getQuestionByAnswerId(answer.id);
            }
            return {questions, answers};
        }catch (error) {
            console.log(error);
            return false;
        }
    }
    async getStatistics(userId){
        try {
            const questionsCount = await this._getQuestionsCount(userId);
            const answersCount = await this._getAnswersCount(userId);
            return {questionsCount, answersCount};
        }catch (error) {
            console.log(error);
            return false
        }
    }

    async _getQuestionsCount(userId){
        const sql = "SELECT COUNT(*) as count FROM questions WHERE created_by=?";
        try{
        const data = await this.databaseConnector.query(sql, [userId]);
        return data.data[0].count;
        }catch (error) {
            throw error;
        }
    }

    async _getAnswersCount(userId){
        const sql = "SELECT COUNT(*) as count FROM answers WHERE created_by=?";
        try{
        const data = await this.databaseConnector.query(sql, [userId]);
        return data.data[0].count;
        }catch (error) {
            throw error;
        }
    }
}

export default UserHelper;