import DatabaseConnector from "../model/DatabaseConnector.mjs";
const databaseConnector = new DatabaseConnector();

const getAllUsers = async () => {
    try {
        const sql = "SELECT id,firstname,lastname,username,email,status,created,usergroup FROM users";
        return await databaseConnector.query(sql, null);
    } catch (error) {
        console.log(error);
    }
}

export default { getAllUsers };