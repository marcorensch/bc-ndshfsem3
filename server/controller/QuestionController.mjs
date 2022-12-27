import DatabaseConnector from "../model/DatabaseConnector.mjs";

class QuestionController{
    databaseConnector = null;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getQuestions(count, index, userId, categoryId, direction){

        let sql = `SELECT * FROM questions`;
        if (userId) sql += ` WHERE created_by=${userId}`;
        if (categoryId) sql += ` WHERE category_id=${categoryId}`;
        if(count) sql += ` LIMIT ${count}`;
        if(index) sql += ` OFFSET ${index}`;
        if(direction) sql += ` ORDER BY id ${direction}`;

        try {
            return await this.databaseConnector.query(sql);
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async storeQuestion(question){
        const sql = "INSERT INTO questions (content, category_id, created_by, anonymous) VALUES (?,?,?,?)";
        try{
            const response = await this.databaseConnector.query(sql, [question.content, question.category_id, question.created_by, question.anonymous]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async getLastQuestionIdFromUser(userId){
        const sql = "SELECT id FROM questions WHERE created_by=? ORDER BY id DESC LIMIT 1";
        try{
            const response = await this.databaseConnector.query(sql, [userId]);
            return response.data[0].id;
        }catch (error) {
            throw error;
        }
    }

    async updateQuestion(question){

    }

    async getQuestionById(id){

    }
}

export default QuestionController;