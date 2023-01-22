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
    } catch (error) {
        console.log(chalk.bold.redBright(`SQL Error: ${error.errno} ${error.code} ${error.text}`));
        return false;
    }
}

async function dropDatabase(connectionData, dbTypeInMsg) {
    try {
        databaseConnector = new DatabaseConnector(connectionData);
        await databaseConnector.dropDatabase(connectionData.database);
        console.log(chalk.bold.green(`${dbTypeInMsg} Database removed successfully`));
        return true;
    } catch (error) {
        if(error.code === 'ER_BAD_DB_ERROR') {
            console.log(chalk.bold.yellow(`Database '${error.text.split("'")[1]}' does not exist`));
        }else{
            _showError(error);
        }
        return false
    }
}

async function create(connectionData, dbTypeInMsg) {
    console.log(chalk.bold.blue(`Creating ${dbTypeInMsg} Database "${connectionData.database}"...`));
    databaseConnector = new DatabaseConnector(connectionData);
    await createDatabase(connectionData.database);
    console.log(chalk.bold.green(`${dbTypeInMsg} Database created successfully`));
    await createTables('./sql/tables');
    console.log(chalk.bold.green(`${dbTypeInMsg} Tables created successfully`));
}

async function createDatabase(dbName) {
    try {
        return await databaseConnector.createDatabase(dbName);
    } catch (error) {
        console.log(chalk.bold.redBright(`SQL Error: ${error.errno} ${error.code} ${error.text}`));
        _showError(error);
    }
}

async function createTables(pathToScripts) {
    const scripts = await getSqlFiles(pathToScripts);
    console.log(scripts);
    const results = [];

    for (const script of scripts) {
        const sql = fs.readFileSync(script, 'utf8');
        try {
            const result = await databaseConnector.query(sql, null);
            results.push({'script': script, 'status': result});
        } catch (error) {
            _showError(error);
        }
    }

    return results;
}

function _showError(error) {
    switch (error.code) {
        case 'ER_ACCESS_DENIED_ERROR':
        case 'ER_DBACCESS_DENIED_ERROR':
            console.log(chalk.bold.redBright(`Access denied for user '${error.sqlMessage.split("'")[1]}'@'${error.sqlMessage.split("'")[3]}'`));
            process.exit(1);
            break;
        case 'ER_BAD_DB_ERROR':
            console.log(chalk.bold.redBright(`Database '${error.text.split("'")[1]}' doesn't exist`));
            process.exit(1);
            break;
        case 'ER_DB_CREATE_EXISTS':
            console.log(chalk.bold.yellow(`Database '${error.text.split("'")[1]}' already exists`));
            break;
        case 'ER_DB_DROP_EXISTS':
            console.log(chalk.bold.yellow(`Database '${error.text.split("'")[1]}' doesn't exist`));
            break;
        default:
            console.log(chalk.bold.redBright(`SQL Error: ${error.errno} ${error.code} ${error.text}`));
            process.exit(1);
    }
}

async function getSqlFiles(pathToScripts) {
    try {
        const dirents = await fs.promises.readdir(pathToScripts, {withFileTypes: true});
        const files = dirents.filter(file => path.extname(file.name) === '.sql');
        return files.map(file => path.join(pathToScripts, file.name));
    } catch (error) {
        console.log(error);
        return [];
    }
}

export { create, dropDatabase, addAdminUser };
