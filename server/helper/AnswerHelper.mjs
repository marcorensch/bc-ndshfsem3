import DatabaseConnector from "../model/DatabaseConnector.mjs";

class AnswerHelper {
    databaseConnector = null;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }
    async getItems(question_id) {
        let data = [];
        const answers_sql = "SELECT qa.question_id, qa.answer_id, a.*, u.username, u.firstname, u.lastname FROM question_answers qa"+
            " JOIN answers a ON qa.answer_id = a.id"+
            " LEFT OUTER JOIN users u ON a.created_by = u.id"+
            " WHERE question_id=?"
        try {
            const answers = await this.databaseConnector.query(answers_sql, [question_id]);
            data = answers.data;
        }   catch (error) {
            console.log(error);
        }
        for (let answer of data) {
            let votes = await this.getItemVotes(answer.id);
            votes.total = votes.reduce((total, vote) => total + vote.vote, 0);
            answer.votes = { data: votes, total: votes.total };
        }
        return data;
    }
    async storeItem(answer) {
        const sql = "INSERT INTO answers (content, created_by) VALUES (?,?)";
        try {
            const response = await this.databaseConnector.query(sql, [answer.content, answer.user_id]);
            const answer_id = await this._getLastItemIdCreatedByUserId(answer.user_id);
            await this._linkAnswerToQuestion(answer_id, answer.question_id);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async deleteItem(id){
        await this._deleteAnswerVotes(id);
        await this._deleteFromQuestionAnswers(id);
        await this._deleteAnswer(id);
        return true;
    }
    async updateItem(id, data) {
        const sql = `UPDATE answers SET content=?, modified_at=NOW() WHERE id=?`;
        try {
            return await this.databaseConnector.query(sql, [data, id]);
        }catch (error) {
            console.log("Error while updating answer");
            console.log(error);
        }
        return false;
    }
    async _deleteFromQuestionAnswers(answerId) {
        const sql = `DELETE FROM question_answers WHERE answer_id=?`;
        try {
            return await this.databaseConnector.query(sql, [answerId]);
        }catch (error) {
            console.log("Error while deleting from question_answers");
            console.log(error);
        }
    }
    async _deleteAnswer(answerId) {
        const sql = `DELETE FROM answers WHERE id=?`;
        try {
            return await this.databaseConnector.query(sql, [answerId]);
        }catch (error) {
            console.log("Error while deleting answer");
            console.log(error);
        }
    }
    async _deleteAnswerVotes(answerId) {
        const sql = `DELETE FROM answer_votes WHERE answer_id=?`;
        try {
            return await this.databaseConnector.query(sql, [answerId]);
        }catch (error) {
            console.log("Error while deleting answer votes");
            console.log(error);
        }
    }
    async getItemById(id) {
        const sql = "SELECT * FROM answers WHERE id=?";
        try {
            const response = await this.databaseConnector.query(sql, [id]);
            return response.data[0];
        } catch (error) {
            throw error;
        }
    }
    async getItemVotes(answer_id) {
        const sql = "SELECT av.user_id, av.voting as vote FROM answer_votes av WHERE answer_id=?";
        try {
            const res = await this.databaseConnector.query(sql, [answer_id]);
            return res.data;
        } catch (error) {
            console.log("Error while getting votes");
            console.log(error);
        }
    }
    async _getLastItemIdCreatedByUserId(userId) {
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
            return await this.databaseConnector.query(sql, [question_id, answer_id]);
        } catch (error) {
            throw error;
        }
    }
    async vote(answerId, userId, newVotingValue) {
        const vote = await this._getVote(answerId, userId);
        if(vote?.voting === newVotingValue) {
            return await this._removeVote(answerId, userId);
        }
        return vote ? await this._updateVote(vote.id, newVotingValue) : await this._createVote(answerId, userId, newVotingValue);
    }
    async _updateVote(id, voting) {
        const sql = `UPDATE answer_votes SET voting=? WHERE id=?`;
        try {
            return await this.databaseConnector.query(sql, [voting, id]);
        }catch (error) {
            console.log("Error while updating vote");
            console.log(error);
        }
    }
    async _createVote(answerId, userId, voting) {
        const sql = `INSERT INTO answer_votes (answer_id, user_id, voting) VALUES (?,?,?)`;
        try {
            return await this.databaseConnector.query(sql, [answerId, userId, voting]);
        }catch (error) {
            console.log("Error while creating vote");
            console.log(error);
        }
    }
    async _removeVote(answerId, userId) {
        const sql = `DELETE FROM answer_votes WHERE user_id=? AND answer_id=?`;
        try {
            return await this.databaseConnector.query(sql, [userId, answerId]);
        }catch (error) {
            console.log("Error while deleting vote");
            console.log(error);
        }
    }
    async _getVote(answerId, userId) {
        const sql = `SELECT id, voting FROM answer_votes WHERE user_id=? AND answer_id=? LIMIT 1`;
        try {
            const res = await this.databaseConnector.query(sql, [userId, answerId]);
            return res.data[0];
        }catch (error) {
            console.log("Error while getting id of vote");
            console.log(error);
        }
    }
}

export default AnswerHelper;