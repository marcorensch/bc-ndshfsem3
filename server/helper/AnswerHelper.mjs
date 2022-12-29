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
        }catch (error) {
            throw error;
        }
    }

    async getLastItemIdCreatedByUserId(userId){
        const sql = "SELECT id FROM answers WHERE created_by=? ORDER BY id DESC LIMIT 1";
        try{
            const response = await this.databaseConnector.query(sql, [userId]);
            return response.data[0].id;
        }catch (error) {
            throw error;
        }
    }

    async _linkAnswerToQuestion(answer_id, question_id) {
        const sql = "INSERT INTO question_answers (question_id, answer_id) VALUES (?,?)";
        try {
            const response = await this.databaseConnector.query(sql, [question_id, answer_id]);
            return response;
        }catch (error) {
            throw error;
        }
    }
}

export default AnswerHelper;