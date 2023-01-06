import DatabaseConnector from "../model/DatabaseConnector.mjs";

class CategoryHelper {
    databaseConnector = null;
    constructor(connectionData) {
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

    async deleteItemBy(key, value) {
        const sql = `DELETE FROM categories WHERE ${key} = ?`;
        try{
            const response = await this.databaseConnector.query(sql, [value]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async checkAliasExists(alias) {
        const sql = "SELECT COUNT(*) AS count FROM categories WHERE alias = ?";
        try{
            const response = await this.databaseConnector.query(sql, [alias]);
            return response.data[0].count;
        }catch (error) {
            throw error;
        }
    }

    async unlinkQuestionsFromCategory(id) {
        const sql = "UPDATE questions SET category_id = NULL WHERE category_id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [id]);
            return response;
        }catch (error) {
            throw error;
        }
    }
}

export default CategoryHelper;