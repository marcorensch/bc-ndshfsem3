import DatabaseConnector from "../model/DatabaseConnector.mjs";

class CategoryController{
    databaseConnector = null;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getCategories(){
        const sql = "SELECT id, name FROM categories";
        try{
            const response = await this.databaseConnector.query(sql, null);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async storeCategory(category){
        const sql = "INSERT INTO categories (title, alias) VALUES (?,?)";
        try{
            const response = await this.databaseConnector.query(sql, [category.title, category.alias]);
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

export default CategoryController;