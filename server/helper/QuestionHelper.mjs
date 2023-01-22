import DatabaseConnector from "../model/DatabaseConnector.mjs";
import AnswerHelper from "./AnswerHelper.mjs";

class QuestionHelper {
    databaseConnector = null;
    constructor(connectionData) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }
    setAcceptedAnswer(questionId, answerId) {
        const sql = "UPDATE questions SET accepted_id=? WHERE id=?";
        return this.databaseConnector.query(sql, [answerId, questionId]);
    }
    async getItems(queryParams) {
        let sql = `SELECT q.*, c.title AS categoryTitle, u.firstname, u.lastname, u.username
                   FROM questions q`
            + ` LEFT JOIN categories c ON q.category_id = c.id`
            + ` LEFT JOIN users u ON q.created_by = u.id`;
        if (queryParams.user_id) sql += ` WHERE created_by=${queryParams.user_id}`;
        if (queryParams.user_id && queryParams.category_id) {
            sql += ` AND category_id=${queryParams.category_id}`;
        } else if (queryParams.category_id) {
            sql += ` WHERE category_id=${queryParams.category_id}`;
        }
        if (queryParams.direction) sql += ` ORDER BY id ${queryParams.direction}`;
        if (queryParams.count) sql += ` LIMIT ${queryParams.count}`;
        if (queryParams.page) {
            const offset = (queryParams.page - 1) * queryParams.count;
            sql += ` OFFSET ${offset}`
        }
        try {
            let questions = await this.databaseConnector.query(sql);
            for (let question of questions.data) {
                question.tags = await this.getTagsByQuestionId(question.id);
            }
            return questions;
        } catch (error) {
            throw error;
        }
    }
    async getTagsByQuestionId(id) {
        const sql = "SELECT t.id, t.title, t.alias FROM question_tags qt" +
            " JOIN tags t ON qt.tag_id = t.id" +
            " WHERE qt.question_id=?";
        try {
            const response = await this.databaseConnector.query(sql, [id]);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    }
    async storeItem(question) {
        const sql = "INSERT INTO questions (content, category_id, created_by, anonymous) VALUES (?,?,?,?)";
        try {
            const response = await this.databaseConnector.query(sql, [question.content, question.category_id, question.created_by, question.anonymous]);
            return response.data.insertId;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async updateItem(question) {
        try {
            await this._updateQuestion(question);
            await this._updateQuestionTags(question.id, question.tags);
            return true;
        } catch (error) {
            console.log(`Error updating question with id ${question.id}`);
            console.log(error);
            return false;
        }
    }
    async _updateQuestion(question) {
        const sql = "UPDATE questions SET content=?, category_id=?, anonymous=?, accepted_id=?, modified_at=NOW() WHERE id=?";
        try {
            await this.databaseConnector.query(sql, [question.content, question.category_id, question.anonymous, question.accepted_id, question.id]);
        } catch (error) {
            throw error;
        }
        return true
    }
    async getQuestionByAnswerId(id) {
        const sql = "SELECT content, id FROM questions WHERE id=(SELECT question_id FROM question_answers WHERE answer_id=?)";
        try {
            const res = await this.databaseConnector.query(sql, [id]);
            return res.data[0];
        }catch (error) {
            console.log(error);
            return {};
        }
    }
    async getItemById(id) {
        let question;
        const answerHelper = new AnswerHelper(this.databaseConnector.connectionData);
        const question_sql = "SELECT q.*, c.title AS categoryTitle, u.firstname, u.lastname, u.username FROM questions q" +
            " LEFT OUTER JOIN categories c ON q.category_id = c.id" +
            " LEFT OUTER JOIN users u ON q.created_by = u.id" +
            " WHERE q.id=?";
        try {
            const questionData = await this.databaseConnector.query(question_sql, [id]);
            question = questionData.data[0];
            question.tags = await this.getTagsByQuestionId(id);

            let votes = await this.getItemVotes(id);
            votes.total = votes.reduce((total, vote) => total + vote.vote, 0);
            question.votes = {data: votes, total: votes.total};
            question.answers = await answerHelper.getItems(id);
        } catch (error) {
            console.log(error);
            return {};
        }
        return question;
    }
    async getTotalCount(category_id) {
        let sql = "SELECT COUNT(*) AS count FROM questions";
        if (category_id) sql += ` WHERE category_id=${category_id}`;
        try {
            const response = await this.databaseConnector.query(sql);
            return response.data[0].count;
        } catch (error) {
            console.log(error);
            return 0;
        }
    }
    async vote(questionId, userId, newVotingValue) {
        const vote = await this._getVote(questionId, userId);
        if (vote?.voting === newVotingValue) {
            return await this._removeVote(questionId, userId);
        }
        return vote ? await this._updateVote(vote.id, newVotingValue) : await this._createVote(questionId, userId, newVotingValue);
    }
    async getItemVotes(questionId) {
        const sql = "SELECT user_id, voting as vote FROM question_votes av WHERE question_id=?";
        try {
            const res = await this.databaseConnector.query(sql, [questionId]);
            return res.data;
        } catch (error) {
            console.log("Error while getting votes");
            console.log(error);
        }
    }
    async _updateVote(id, voting) {
        const sql = "UPDATE question_votes SET voting=? WHERE id = ?";
        try {
            return await this.databaseConnector.query(sql, [voting, id]);
        } catch (error) {
            console.log("Error while updating vote");
            console.log(error);
        }
    }
    async _createVote(questionId, userId, voting) {
        const sql = "INSERT INTO question_votes (question_id, user_id, voting) VALUES (?, ?, ?)";
        try {
            return await this.databaseConnector.query(sql, [questionId, userId, voting]);
        } catch (error) {
            console.log("Error while creating vote");
            console.log(error);
        }
    }
    async _removeVote(questionId, userId) {
        const sql = "DELETE FROM question_votes WHERE user_id = ? AND question_id = ?";
        try {
            return await this.databaseConnector.query(sql, [userId, questionId]);
        } catch (error) {
            console.log("Error while deleting vote");
            console.log(error);
        }
    }
    async _getVote(questionId, userId) {
        const sql = "SELECT id, voting FROM question_votes WHERE user_id = ? AND question_id = ? LIMIT 1";
        try {
            const res = await this.databaseConnector.query(sql, [userId, questionId]);
            return res.data[0];
        } catch (error) {
            console.log("Error while getting id of vote");
            console.log(error);
        }
    }
    async getKeyValue(itemId, key) {
        const sql = `SELECT ${key} FROM questions WHERE id = ? LIMIT 1`;
        try {
            const res = await this.databaseConnector.query(sql, [itemId]);
            return res.data[0][key]
        } catch (error) {
            console.log(`Error while getting value for key ${key} of question ${itemId}`);
            console.log(error);
        }
    }
    async deleteItem(questionId) {
        const answerHelper = new AnswerHelper(this.databaseConnector.connectionData);
        const answers = await answerHelper.getItems(questionId);
        try {
            await this._removeAcceptedId(questionId);
            for (const answer of answers) {
                await answerHelper.deleteItem(answer.id);
            }
            await this._deleteQuestionVotes(questionId);
            await this._deleteQuestionTags(questionId);
            await this.deleteItemBy('id', questionId);
        } catch (error) {
            console.log("Error while deleting question");
            console.log(error);
            return false
        }
        return true;
    }
    async deleteItemBy(key, value) {
        const sql = `DELETE FROM questions WHERE ${key} = ?`;
        try {
            return await this.databaseConnector.query(sql, [value]);
        } catch (error) {
            throw error;
        }
    }
    async _deleteQuestionVotes(questionId) {
        const sql = `DELETE FROM question_votes WHERE question_id = ?`;
        try {
            return await this.databaseConnector.query(sql, [questionId]);
        } catch (error) {
            throw error;
        }
    }
    async storeTags(questionId, tags) {
        const values = tags.map(tag => `('${tag}','${this._createAlias(tag)}')`).join(",");
        let sql = `INSERT IGNORE INTO tags (title, alias) VALUES ${values}`;
        try {
            await this.databaseConnector.query(sql);
        } catch (error) {
            console.log(error);
            return false;
        }
        await this._linkTagsToQuestion(questionId, tags);
        return true;
    }
    async _updateQuestionTags(questionId, tags) {
        try {
            await this._deleteQuestionTags(questionId);
            await this.storeTags(questionId, tags);
            return true
        } catch (error) {
            throw error;
        }
    }
    async _deleteQuestionTags(questionId) {
        const sql = `DELETE FROM question_tags WHERE question_id = ?`;
        try {
            return await this.databaseConnector.query(sql, [questionId]);
        } catch (error) {
            throw error;
        }
    }
    async _linkTagsToQuestion(createdQuestionId, tags) {
        const values = tags.map(tag => `((SELECT id FROM tags WHERE title='${tag}'),${createdQuestionId})`).join(",");
        let sql = `INSERT IGNORE INTO question_tags (tag_id, question_id) VALUES ${values}`;
        try {
            await this.databaseConnector.query(sql);
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }
    async _removeAcceptedId(id) {
        const sql = `UPDATE questions SET accepted_id=NULL WHERE id = ?`;
        try {
            return await this.databaseConnector.query(sql, [id]);
        } catch (error) {
            throw error;
        }
    }
    _createAlias(string) {
        return string.toLowerCase().replace(/ /g, "-");
    }
}

export default QuestionHelper;
