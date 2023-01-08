import DatabaseConnector from "../model/DatabaseConnector.mjs";
import {re} from "@babel/core/lib/vendor/import-meta-resolve.js";

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
        };

        try {
            return await this.databaseConnector.query(sql);
        } catch (error) {
            console.error(error);
            return error;
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
        const sql = "UPDATE questions SET content=?, category_id=?, anonymous=? WHERE id=?";
        try{
            const response = await this.databaseConnector.query(sql, [question.content, question.category_id, question.anonymous, question.id]);
            return response;
        }catch (error) {
            console.log(error);
            return false;
        }
    }

    async getItemById(id){
        const question_sql = "SELECT q.*, c.title AS categoryTitle, u.firstname, u.lastname, u.username FROM questions q"+
            " JOIN categories c ON q.category_id = c.id"+
            " JOIN users u ON q.created_by = u.id"+
            " WHERE q.id=?";
        const answers_sql = "SELECT qa.question_id, qa.answer_id, a.*, u.username, u.firstname, u.lastname FROM question_answers qa"+
            " JOIN answers a ON qa.answer_id = a.id"+
            " JOIN users u ON a.created_by = u.id"+
            " WHERE question_id=?"
        try{
            const question = await this.databaseConnector.query(question_sql, [id]);
            const answers = await this.databaseConnector.query(answers_sql, [id]);
            return {question: question.data[0], answers: answers.data};
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
            const response = await this.databaseConnector.query(sql, [value]);
            return response;
        }catch (error) {
            console.log(error);
            return false;
        }
    }
}

export default QuestionHelper;