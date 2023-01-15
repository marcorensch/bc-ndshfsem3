import DatabaseConnector from "../model/DatabaseConnector.mjs";

class AnswerHelper {
    databaseConnector = null;

    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getItems(question_id) {

    }

    async storeItem(answer) {
        const sql = "INSERT INTO answers (content, created_by) VALUES (?,?)";
        try {
            const response = await this.databaseConnector.query(sql, [answer.content, answer.user_id]);
            const answer_id = await this.getLastItemIdCreatedByUserId(answer.user_id);
            await this._linkAnswerToQuestion(answer_id, answer.question_id);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getLastItemIdCreatedByUserId(userId) {
        const sql = "SELECT id FROM answers WHERE created_by=? ORDER BY id DESC LIMIT 1";
        try {
            const response = await this.databaseConnector.query(sql, [userId]);
            return response.data[0].id;
        } catch (error) {
            throw error;
        }
    }

    async _linkAnswerToQuestion(answer_id, question_id) {
        const sql = "INSERT INTO question_answers (question_id, answer_id) VALUES (?,?)";
        try {
            const response = await this.databaseConnector.query(sql, [question_id, answer_id]);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async vote(id, userId, voting) {
        const idOfVote = await this._getIdOfVote(id, userId);
        const res = idOfVote ? await this._updateVote(idOfVote, voting) : await this._createVote(id, userId, voting);
        return res;
    }
    async _updateVote(id, voting) {
        const sql = `UPDATE answer_votes SET voting=? WHERE id=?`;
        try {
            const res = await this.databaseConnector.query(sql, [voting, id]);
            return res;
        }catch (error) {
            console.log("Error while updating vote");
            console.log(error);
        }
    }
    async _createVote(answerId, userId, voting) {
        const sql = `INSERT INTO answer_votes (answer_id, user_id, voting) VALUES (?,?,?)`;
        try {
            const res = await this.databaseConnector.query(sql, [answerId, userId, voting]);
            return res;
        }catch (error) {
            console.log("Error while creating vote");
            console.log(error);
        }
    }
    async _getIdOfVote(answerId, userId) {
        const sql = `SELECT id FROM answer_votes WHERE user_id=? AND answer_id=? LIMIT 1`;
        try {
            const res = await this.databaseConnector.query(sql, [userId, answerId]);
            console.log(res);
            return res.data[0];
        }catch (error) {
            console.log("Error while getting id of vote");
            console.log(error);
        }
    }
}

export default AnswerHelper;