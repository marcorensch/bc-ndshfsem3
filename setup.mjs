import * as dotenv from 'dotenv';
dotenv.config();
process.env.NODE_ENV = 'setup';

import * as crypto from "crypto";
import * as fs from 'node:fs/promises';
import chalk from 'chalk';
import * as readline from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';
import {create, dropDatabase, addAdminUser} from './installDatabase.mjs';
import User from "./server/model/User.mjs";

const configuration = {
    "https": {
        "key": "HTTPS",
        "hint": "true or false",
        "default": true,
        "frontend": true,
    },
    "access_token_secret": {
        "key": "ACCESS_TOKEN_SECRET",
    },
    "refresh_token_secret": {
        "key": "REFRESH_TOKEN_SECRET",
    },
    "session_secret": {
        "key": "SESSION_SECRET",
    },
    "token_validity": {
        "key": "JWT_TOKEN_VALIDITY",
        "default": "15m",
        "hint": "The validity of the login token (1m, 1h, 1d, 1w, 1y)"
    },
    "refresh_token_validity": {
        "key": "JWT_REFRESH_TOKEN_VALIDITY",
        "default": "1w",
        "hint": "The validity of the refresh token (Auto Login Refresh) (1m, 1h, 1d, 1w, 1y)"
    },
    "db_host": {
        "key": "DB_HOST",
        "default": "localhost",
        "hint": "The host of the database"
    },
    "db_port": {
        "key": "DB_PORT",
        "default": "3306",
        "hint": "The port of the database"
    },
    "db_user": {
        "key": "DB_USER",
        "default": "root",
        "hint": "The user of the database"
    },
    "db_password": {
        "key": "DB_PASSWORD",
        "default": "",
        "hint": "The password of the database"
    },
    "db_name": {
        "key": "DB_NAME",
        "default": "babylon",
        "hint": "The name of the database"
    },
    "test_db_name": {
        "key": "TEST_DB_NAME",
        "default": "babylon_test",
        "hint": "The name of the database"
    },
    "server_port": {
        "key": "SERVER_PORT",
        "default": "3000",
        "hint": "The port of the server instance",
        "frontend": true,
    }
};
const pathToEnv = './server/.env';
const pathToFrontendEnv = './client/.env';

async function createDotEnvFlow() {
    let doBackup = await rl.question('Do you want to create a Backup of your existing .env file? (' + chalk.italic.cyan('press "y" to create a backup or any key to skip') + ') ');
    if (doBackup.toLowerCase() === 'y') {
        let backupName = await rl.question('Please enter a name for the backup file: ');
        if (!backupName.endsWith('.env')) backupName += '.env';
        try {
            await fs.copyFile(pathToEnv, backupName);
            console.log(chalk.bold.green('Backup created successfully!'));
        } catch (e) {
            console.log(chalk.bold.red('Error creating backup: ' + e));
        }
    }
    try {
        configuration.access_token_secret.value = crypto.randomBytes(64).toString('hex');
        configuration.refresh_token_secret.value = crypto.randomBytes(64).toString('hex');
        configuration.session_secret.value = crypto.randomBytes(64).toString('hex');
        console.log(chalk.bold.green('>>> New Secrets successfully created <<<'));
    } catch (err) {
        console.log(chalk.bold.red('Error creating secrets'));
        console.log("Configuration File not created");
        console.log(err);
        process.exit(1);
    }

    console.log(chalk.bold.yellow('Please enter the following information:'));
    console.log(chalk.italic.grey('Hint: hit Enter to use the default value'));

    for (const [id, object] of Object.entries(configuration)) {
        if (object.value == null) {
            const hint = object.hint != null ? chalk.gray.italic('(' + object.hint + ')') : '';
            const defaultValue = object.default != null ? chalk.gray.italic(' [Default: ' + object.default + ']') : '';
            const userInput = await rl.question('Please enter a value for ' + chalk.bold.blue(object.key) + "\n" + hint + defaultValue + ': ');
            if (userInput === '') {
                object.value = object.default;
            } else {
                object.value = userInput;
            }
        }
    }

    const configString = Object.keys(configuration).map(key => `${configuration[key].key}=${configuration[key].value}`).join('\n');
    console.log(configString);
    const frontendConfigString = Object.keys(configuration).filter(key => configuration[key].frontend).map(key => `VUE_APP_${configuration[key].key}=${configuration[key].value}`).join('\n');

    try {
        await fs.writeFile(pathToEnv, configString, {encoding: 'utf8'});
        await fs.writeFile(pathToFrontendEnv, frontendConfigString, {encoding: 'utf8'});
        console.log('\n-----------------------------------------------------------------------------');
        console.log(chalk.green.bold('The configuration files have been stored!'));
        console.log("The Configuration file can be found at: " + chalk.bold.blue(pathToEnv));
        console.log(chalk.bold('Note:') + '\nYou can change the configuration at any time by editing the .env file.');
        console.log(chalk.bold.yellow('\nNEW SECRET TOKENS WHERE CREATED - SECRETS SHOULD NOT BE SHARED WITH ANYONE!'));
        console.log("\nPlease make sure your Database is running and the credentials are correct.");
        console.log("You can now using " + chalk.bold("npm run devStart") + " to start your server.");
        console.log('-----------------------------------------------------------------------------\n');
    } catch (err) {
        console.log(chalk.bold.red('Error writing configuration file'));
        console.log("Configuration File not created");
        console.log(err);
        process.exit(1);
    }
}

async function skipDotEnvFlow() {
    console.log(chalk.bold.yellow('Skipping Configuration...'));
    const fileExists = async pathToEnv => !!(await fs.stat(pathToEnv).catch(e => false)); // https://sabe.io/blog/node-check-file-exists-async-await

    if (await fileExists(pathToEnv)) {
        console.log(chalk.bold.yellow('Found existing .env file...'));
        const envConfig = dotenv.parse(await fs.readFile(pathToEnv));
        for (const [index, config] of Object.entries(configuration)) {
            if (envConfig[config.key] != null) {
                config.value = envConfig[config.key];
            }
        }
        console.log("\n---------------------- Loaded Configuration: ----------------------");
        console.log(configuration)
        console.log("-------------------------------------------------------------------\n");
        console.log(chalk.bold.green('Configuration loaded successfully from .env file!'));
    } else {
        console.log(chalk.bold.yellow('No .env file found. Cannot load configuration...'));
        console.log(chalk.bold.red('Cannot proceed without configuration!'));
        rl.close();
        process.exit(1);
    }
}

async function installDatabase(type) {
    let dbNameSuffix = type === 'test' ? '_test' : '';
    let dbTypeInMsg = type === 'test' ? 'Test' : 'Production';
    let connectionData = {
        host: configuration.db_host.value,
        port: configuration.db_port.value,
        user: configuration.db_user.value,
        password: configuration.db_password.value,
        database: configuration.db_name.value + dbNameSuffix,
    }

    const removeDb = await rl.question(`Do you want to remove the existing ${dbTypeInMsg} database? (${chalk.italic.cyan('press "y" to remove or any key to skip')})`);
    if (removeDb.toLowerCase() === 'y') {
        console.log(`Try to remove existing ${dbTypeInMsg} Database...`);
        await dropDatabase(connectionData, dbTypeInMsg);
    }

    console.log(`Using the following scripts to create ${dbTypeInMsg} Database...`);
    await create(connectionData, dbTypeInMsg);
}

async function createAdminUser() {
    let connectionData = {
        host: configuration.db_host.value,
        port: configuration.db_port.value,
        user: configuration.db_user.value,
        password: configuration.db_password.value,
        database: configuration.db_name.value,
    }

    let username = await rl.question(`Please enter a ${chalk.bold('username')} for the admin user:`);
    let password = await rl.question(`Please enter a ${chalk.bold('password')} for the admin user:`);
    let email = await rl.question(`Please enter an ${chalk.bold('email')} for the admin user:`);

    const admin = new User("Administrator", "Babylon", username, email);
    admin.setPassword(password, false);

    await addAdminUser(connectionData, admin);
}


console.log("\n")
console.log("###############################################");
console.log(chalk.bold(" Configuration Initialisation"));
console.log(chalk.gray.italic(" by NXD | Marco Rensch"));
console.log("###############################################\n");

const rl = readline.createInterface({input, output});

let doEnvConfig = await rl.question(chalk.bold.red("Attention: ") + ' This Script creates new secrets for the .env file. Stored user credentials will not work anymore when proceeding.\nDo you want to continue? (' + chalk.italic.cyan('press "y" to continue or any key to skip') + ') ');
doEnvConfig.toLowerCase() === 'y' ? await createDotEnvFlow() : await skipDotEnvFlow();

const installDb = await rl.question('Do you want to install the database? Please make sure your MariaDB or MySQL instance is running before proceed (' + chalk.italic.cyan('press "y" to install or any key to skip') + ') ');
installDb.toLowerCase() === 'y' ? await installDatabase() : console.log(chalk.bold.yellow('Skipping Database Installation...'));

const addAdmin = await rl.question('Do you want to create an admin user? (' + chalk.italic.cyan('press "y" to create or any key to skip') + ') ');
addAdmin.toLowerCase() === 'y' ? await createAdminUser() : console.log(chalk.bold.yellow('Skipping Admin User Creation...'));

const installTestDb = await rl.question('Do you want to install the test database? (' + chalk.italic.cyan('press "y" to install or any key to skip') + ') ');
installTestDb.toLowerCase() === 'y' ? await installDatabase('test') : console.log(chalk.bold.yellow('Skipping Test Database Installation...'));

rl.close();

console.log("\n\n")
console.log("###############################################");
console.log(chalk.bold("Thank you, Have a nice day!"));
console.log("###############################################");
console.log("\n\n")

process.exit(0);