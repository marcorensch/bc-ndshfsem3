import DatabaseConnector from "../model/DatabaseConnector.mjs";

class CategoryHelper {
    databaseConnector = null;
    constructor(connectionData) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getCategories(onlyFavorites = false) {
        let sql = "SELECT id, title, fav FROM categories ORDER BY title ASC";
        if(onlyFavorites){
            sql = "SELECT id, title, fav FROM categories WHERE fav = 1 ORDER BY title ASC";
        }
        try{
            const response = await this.databaseConnector.query(sql, null);
            console.log(onlyFavorites, response);
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
        const sql = "UPDATE categories SET title=?, alias=?, fav=? WHERE id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [category.title, category.alias, category.isFavorite, category.id]);
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

    async doesAliasExists(alias) {
        const sql = "SELECT count(id) as count FROM categories where alias = ?";
        try{
            const response = await this.databaseConnector.query(sql, [alias]);
            return Number(response.data[0].count) > 0;
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