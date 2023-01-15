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
            " JOIN users u ON a.created_by = u.id"+
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
        const vote = await this._getVote(id, userId);
        if(vote?.voting === voting) {
            return await this._removeVote(id, userId);
        }
        const res = vote ? await this._updateVote(vote.id, voting) : await this._createVote(id, userId, voting);
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
    async _removeVote(answerId, userId) {
        const sql = `DELETE FROM answer_votes WHERE user_id=? AND answer_id=?`;
        try {
            const res = await this.databaseConnector.query(sql, [answerId, userId]);
            return res;
        }catch (error) {
            console.log("Error while deleting vote");
            console.log(error);
        }
    }
    async _getVote(answerId, userId) {
        const sql = `SELECT id, voting FROM answer_votes WHERE user_id=? AND answer_id=? LIMIT 1`;
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