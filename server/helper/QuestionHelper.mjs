import DatabaseConnector from "../model/DatabaseConnector.mjs";
import AnswerHelper from "./AnswerHelper.mjs";

class QuestionHelper {
    databaseConnector = null;
    constructor(connectionData) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getItems(queryParams){
        let sql = `SELECT q.*, c.title AS categoryTitle, u.firstname, u.lastname, u.username FROM questions q`
            +` LEFT JOIN categories c ON q.category_id = c.id`
            +` LEFT JOIN users u ON q.created_by = u.id`;

        if(queryParams.user_id) sql += ` WHERE created_by=${queryParams.user_id}`;
        if(queryParams.user_id && queryParams.category_id){
            sql += ` AND category_id=${queryParams.category_id}`;
        }else if(queryParams.category_id){
            sql += ` WHERE category_id=${queryParams.category_id}`;
        }

        if(queryParams.direction) sql += ` ORDER BY id ${queryParams.direction}`;
        if(queryParams.count) sql += ` LIMIT ${queryParams.count}`;
        if(queryParams.page) {
            const offset = (queryParams.page -1) * queryParams.count;
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

    async getTagsByQuestionId(id){
        const sql = "SELECT t.id, t.title, t.alias FROM question_tags qt"+
            " JOIN tags t ON qt.tag_id = t.id"+
            " WHERE qt.question_id=?";
        try{
            const response = await this.databaseConnector.query(sql, [id]);
            return response.data;
        }catch (error) {
            console.log(error);
            return [];
        }
    }

    async storeItem(question){
        const sql = "INSERT INTO questions (content, category_id, created_by, anonymous) VALUES (?,?,?,?)";
        try{
            const response = await this.databaseConnector.query(sql, [question.content, question.category_id, question.created_by, question.anonymous]);
            return response.data.insertId;
        }catch (error) {
            console.log(error);
            return false;
        }
    }

    async getLastItemIdCreatedByUserId(userId){
        const sql = "SELECT id FROM questions WHERE created_by=? ORDER BY id DESC LIMIT 1";
        try{
            const response = await this.databaseConnector.query(sql, [userId]);
            return response.data[0].id;
        }catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateItem(question){
        console.log(question);
        const sql = "UPDATE questions SET content=?, category_id=?, anonymous=?, accepted_id=? WHERE id=?";
        try{
            return await this.databaseConnector.query(sql, [question.content, question.category_id, question.anonymous,question.accepted_id, question.id]);
        }catch (error) {
            console.log(error);
            return false;
        }
    }

    async getItemById(id){
        const answerHelper = new AnswerHelper(this.databaseConnector.connectionData);
        const question_sql = "SELECT q.*, c.title AS categoryTitle, u.firstname, u.lastname, u.username FROM questions q"+
            " JOIN categories c ON q.category_id = c.id"+
            " JOIN users u ON q.created_by = u.id"+
            " WHERE q.id=?";

        try{
            const question = await this.databaseConnector.query(question_sql, [id]);
            question.data[0].tags = await this.getTagsByQuestionId(question.data[0].id);
            let votes = await this.getItemVotes(id);
            votes.total = votes.reduce((total, vote) => total + vote.vote, 0);
            question.data[0].votes = { data: votes, total: votes.total };
            const answers = await answerHelper.getItems(id);

            return {question: question.data[0], answers};
        }catch (error) {
            console.log(error);
            return {};
        }
    }

    async getTotalCount(category_id) {
        let sql = "SELECT COUNT(*) AS count FROM questions";
        if(category_id) sql += ` WHERE category_id=${category_id}`;
        try{
            const response = await this.databaseConnector.query(sql);
            return response.data[0].count;
        }catch (error) {
            console.log(error);
            return 0;
        }
    }

    async storeTags(createdQuestionId, tags) {
        const values = tags.map(tag => `('${tag}','${this._createAlias(tag)}')`).join(",");
        let sql = `INSERT IGNORE INTO tags (title, alias) VALUES ${values}`;
        try{
            await this.databaseConnector.query(sql);
        }catch (error) {
            console.log(error);
            return false;
        }

        await this._linkTagsToQuestion(createdQuestionId, tags);
        return true;
    }

    _createAlias(string){
        return string.toLowerCase().replace(/ /g,"-");
    }

    async _linkTagsToQuestion(createdQuestionId, tags) {
        const values = tags.map(tag => `((SELECT id FROM tags WHERE title='${tag}'),${createdQuestionId})`).join(",");
        console.log(values);
        let sql = `INSERT IGNORE INTO question_tags (tag_id, question_id) VALUES ${values}`;
        try{
            await this.databaseConnector.query(sql);
        }catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }

    async deleteItemBy(key, value){
        const sql = `DELETE FROM questions WHERE ${key}=?`;
        try{
            return await this.databaseConnector.query(sql, [value]);
        }catch (error) {
            console.log(error);
            return false;
        }
    }

    async vote(id, userId, voting) {
        const vote = await this._getVote(id, userId);
        if(vote?.voting === voting) {
            return await this._removeVote(id, userId);
        }
        return vote ? await this._updateVote(vote.id, voting) : await this._createVote(id, userId, voting);
    }

    async getItemVotes(id) {
        const sql = "SELECT user_id, voting as vote FROM question_votes av WHERE question_id=?";
        try {
            const res = await this.databaseConnector.query(sql, [id]);
            return res.data;
        } catch (error) {
            console.log("Error while getting votes");
            console.log(error);
        }

    }

    async _updateVote(id, voting) {
        const sql = `UPDATE question_votes SET voting=? WHERE id=?`;
        try {
            return  await this.databaseConnector.query(sql, [voting, id]);
        }catch (error) {
            console.log("Error while updating vote");
            console.log(error);
        }
    }
    async _createVote(questionId, userId, voting) {
        const sql = `INSERT INTO question_votes (question_id, user_id, voting) VALUES (?,?,?)`;
        try {
            return await this.databaseConnector.query(sql, [questionId, userId, voting]);
        }catch (error) {
            console.log("Error while creating vote");
            console.log(error);
        }
    }
    async _removeVote(questionId, userId) {
        const sql = `DELETE FROM question_votes WHERE user_id=? AND question_id=?`;
        try {
            return await this.databaseConnector.query(sql, [userId, questionId]);
        }catch (error) {
            console.log("Error while deleting vote");
            console.log(error);
        }
    }
    async _getVote(questionId, userId) {
        const sql = `SELECT id, voting FROM question_votes WHERE user_id=? AND question_id=? LIMIT 1`;
        try {
            const res = await this.databaseConnector.query(sql, [userId, questionId]);
            return res.data[0];
        }catch (error) {
            console.log("Error while getting id of vote");
            console.log(error);
        }
    }

    async setAcceptedId(id, accepted_id) {
        const sql = `UPDATE questions SET accepted_id=? WHERE id=?`;
        try {
            return await this.databaseConnector.query(sql, [accepted_id, id]);
        }catch (error) {
            console.log("Error while updating accepted id");
            console.log(error);
        }
    }
}

export default QuestionHelper;
