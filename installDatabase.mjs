import DatabaseConnector from "./server/model/DatabaseConnector.mjs";
import fs from "fs";
import path from "path";
import UserHelper from "./server/helper/UserHelper.mjs";
import chalk from "chalk";

let databaseConnector;

async function addAdminUser(connectionData, adminUser) {

    const userController = new UserHelper(connectionData);
    adminUser.usergroup = await userController._getUserGroupIdByAlias("administrator");

    try {
        await userController.registerUser(adminUser);
        return true;
    } catch (err) {
        console.log(chalk.bold.redBright(`SQL Error: ${err.errno} ${err.code} ${err.text}`));
        return false;
    }

}

async function dropDatabase(connectionData) {

    try {
        databaseConnector = new DatabaseConnector(connectionData);
        const result = await databaseConnector.dropDatabase(connectionData.database);
        return true; // Note: The current connector does not return anything usable on drop database if no error occurs.
    } catch (err) {
        console.log(chalk.bold.redBright(`SQL Error: ${err.errno} ${err.code} ${err.text}`));
        return false;
    }
}

async function create (connectionData) {
    try {
        databaseConnector = new DatabaseConnector(connectionData);
        await createDatabase(connectionData.database);
        const results = await createTables('./sql/tables');
        return true;
    } catch (err) {
        console.log(chalk.bold.redBright("SQL Error: " + err.errno + " " + err.code + " " + err.text));
        return false;
    }
}

async function createDatabase(dbName) {
    try {
        return await databaseConnector.createDatabase(dbName);
    } catch (err) {
        throw err;
    }
}

async function createTables (pathToScripts) {

    const scripts = await getSqlFiles(pathToScripts);
    console.log(scripts);
    databaseConnector.createPool();
    const results = [];

    for (const script of scripts) {
        const sql = fs.readFileSync(script, 'utf8');
        try {
            const result = await databaseConnector.query(sql, null);
            results.push({'script': script, 'status': result});
        } catch (err) {
            throw err;
        }
    }

    return results;
}

async function getSqlFiles(pathToScripts) {
    try {
        const dirents = await fs.promises.readdir(pathToScripts, {withFileTypes: true});
        const files = dirents.filter(file => path.extname(file.name) === '.sql');
        return files.map(file => path.join(pathToScripts, file.name));
    } catch (err) {
        console.log(err);
        return [];
    }
}

export {create, dropDatabase, addAdminUser};
