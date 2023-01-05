import DatabaseConnector from "../model/DatabaseConnector.mjs";

class UsergroupsHelper {
    constructor(connectionData) {
        this.databaseConnector = new DatabaseConnector(connectionData);
    }
    async getAllUsergroups() {
        const sql = "SELECT id, title, alias FROM usergroups";
        try {
            const response = await this.databaseConnector.query(sql, null);
            return response.data;
        }catch (error) {
            throw error;
        }
    }
}

export default UsergroupsHelper;