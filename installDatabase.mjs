import DatabaseConnector from "./server/model/DatabaseConnector.mjs";
import fs from "fs";
import path from "path";

let databaseConnector;

async function dropDatabase(connectionData) {

    databaseConnector = new DatabaseConnector(connectionData);

    try {
        const result = await databaseConnector.dropDatabase(connectionData.database);
        return true; // Note: The current connector does not return anything usable on drop database
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function create (connectionData) {

    databaseConnector = new DatabaseConnector(connectionData);

    try {
        await createDatabase(connectionData.database);
        const results = await createTables('./sql/tables');
        console.log(results);
        return true;
    } catch (err) {
        throw err;
        return false;
    }
}

async function createDatabase(dbName) {
    try {
        const result = await databaseConnector.createDatabase(dbName);
        return result;
    } catch (err) {
        throw err;
    }
}

async function createTables (pathToScripts) {

    const scripts = await getSqlFiles(pathToScripts);
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

export {create, dropDatabase};
