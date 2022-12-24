import DatabaseConnector from "../model/DatabaseConnector.mjs";

class QuestionController{
    databaseConnector = null;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getQuestions(count, userId, categoryId){

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
            return response;
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