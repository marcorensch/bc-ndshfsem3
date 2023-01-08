import DatabaseConnector from "../model/DatabaseConnector.mjs";

class TagHelper {
    databaseConnector = null;
    constructor(connectionData) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }

    async getTags() {
        let sql = "SELECT t.id, t.title, COUNT(qt.id) as articlesCount " +
            "FROM tags t " +
            "LEFT JOIN question_tags qt ON qt.tag_id = t.id " +
            "GROUP BY t.id " +
            "ORDER BY title ASC";
        try{
            const response = await this.databaseConnector.query(sql, null);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async storeTag(tag){
        const sql = "INSERT INTO tags (title, alias) VALUES (?,?)";
        try{
            const response = await this.databaseConnector.query(sql, [tag.title, tag.alias]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async updateTag(tag){
        const sql = "UPDATE tags SET title=?, alias=? WHERE id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [tag.title, tag.alias, tag.id]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async getItemById(id) {
        const sql = "SELECT id, title FROM tags WHERE id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [id]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async deleteItemById(id) {
        const sql = "DELETE FROM tags WHERE id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [id]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async deleteItemBy(key, value) {
        const sql = `DELETE FROM tags WHERE ${key} = ?`;
        try{
            const response = await this.databaseConnector.query(sql, [value]);
            return response;
        }catch (error) {
            throw error;
        }
    }

    async doesAliasExists(alias) {
        const sql = "SELECT count(id) as count FROM tags where alias = ?";
        try{
            const response = await this.databaseConnector.query(sql, [alias]);
            return Number(response.data[0].count) > 0;
        }catch (error) {
            throw error;
        }
    }

    async unlinkQuestionsFromTag(id) {
        const sql = "DELETE FROM question_tags WHERE tag_id = ?";
        try{
            const response = await this.databaseConnector.query(sql, [id]);
            return response;
        }catch (error) {
            throw error;
        }
    }
}

export default TagHelper;