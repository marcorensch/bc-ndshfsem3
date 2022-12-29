import DatabaseConnector from "../model/DatabaseConnector.mjs";

class QuestionHelper {
    databaseConnector = null;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getItems(queryParams){
        // @ToDo : Inner Join Usernames
        /*
        SELECT q.*, c.title AS categoryTitle, u.firstname, u.lastname, u.username FROM questions q
        LEFT JOIN categories c ON q.category_id = c.id
        LEFT JOIN users u ON q.created_by = u.id
         */
        let sql = `SELECT q.*, c.title AS categoryTitle, u.firstname, u.lastname, u.username FROM questions q`
            +` LEFT JOIN categories c ON q.category_id = c.id`
            +` LEFT JOIN users u ON q.created_by = u.id`;
        if(queryParams.user_id) sql += ` WHERE created_by=${queryParams.user_id}`;

        if(queryParams.direction) sql += ` ORDER BY id ${queryParams.direction}`;
        if(queryParams.count) sql += ` LIMIT ${queryParams.count}`;
        if(queryParams.index) sql += ` OFFSET ${queryParams.index}`;

        if(queryParams.user_id && queryParams.category_id){
            sql += ` AND category_id=${queryParams.category_id}`;
        }else if(queryParams.category_id){
            sql += ` WHERE category_id=${queryParams.category_id}`;
        }
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
            return response;
        }catch (error) {
            throw error;
        }
    }

    async getLastItemIdCreatedByUserId(userId){
        const sql = "SELECT id FROM questions WHERE created_by=? ORDER BY id DESC LIMIT 1";
        try{
            const response = await this.databaseConnector.query(sql, [userId]);
            return response.data[0].id;
        }catch (error) {
            throw error;
        }
    }

    async updateItem(question){
        console.log(question);
        const sql = "UPDATE questions SET content=?, category_id=?, anonymous=? WHERE id=?";
        try{
            const response = await this.databaseConnector.query(sql, [question.content, question.category_id, question.anonymous, question.id]);
            return response;
        }catch (error) {
            throw error;
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
            throw error;
        }
    }
}

export default QuestionHelper;