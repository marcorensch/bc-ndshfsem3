import DatabaseConnector from "../model/DatabaseConnector.mjs";

class CategoryController {
    databaseConnector = null;
    constructor(connectionData = false) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getAllCategories(){
        const sql = "SELECT id, title FROM categories";
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

    async updateCategory(category){
        const sql = "UPDATE categories SET title=?, alias=? WHERE id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [category.title, category.alias, category.id]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async getItemById(id) {
        const sql = "SELECT id, title FROM categories WHERE id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [id]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async deleteItemById(id) {
        const sql = "DELETE FROM categories WHERE id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [id]);
            return response;
        }catch (error) {
            throw error;
        }
    }
}

export default CategoryController;