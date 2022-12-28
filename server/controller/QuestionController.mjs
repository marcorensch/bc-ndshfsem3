import DatabaseConnector from "../model/DatabaseConnector.mjs";

class QuestionController{
    databaseConnector = null;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getItems(queryParams){
        // @ToDo : Inner Join Usernames
        let sql = `SELECT * FROM questions`;
        if(queryParams.user_id) sql += ` WHERE created_by=${queryParams.user_id}`;
        if(queryParams.user_id && queryParams.category_id){
            sql += ` AND category_id=${queryParams.category_id}`;
        }else if(queryParams.category_id){
            sql += ` WHERE category_id=${queryParams.category_id}`;
        }
        if(queryParams.direction) sql += ` ORDER BY id ${queryParams.direction}`;
        if(queryParams.count) sql += ` LIMIT ${queryParams.count}`;
        if(queryParams.index) sql += ` OFFSET ${queryParams.index}`;

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

    }

    async getItemById(id){

    }
}

export default QuestionController;