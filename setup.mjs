import * as dotenv from 'dotenv';
import * as crypto from "crypto";
import * as fs from 'fs';
import chalk from 'chalk';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {create, dropDatabase, addAdminUser}  from './installDatabase.mjs';
import User from "./server/model/User.mjs";

const configuration = {
    "access_token_secret":{
        "key": "ACCESS_TOKEN_SECRET",
    },
    "refresh_token_secret":{
        "key": "REFRESH_TOKEN_SECRET",
    },
    "session_secret":{
        "key": "SESSION_SECRET",
    },
    "db_host":{
        "key": "DB_HOST",
    },
    "db_port":{
        "key": "DB_PORT",
    },
    "db_user":{
        "key": "DB_USER",
    },
    "db_password":{
        "key": "DB_PASSWORD",
    },
    "db_name":{
        "key": "DB_NAME",
    },
    "server_port":{
        "key": "SERVER_PORT",
    }
};

const pathToEnv = './server/.env';

console.log("\n")
console.log("###############################################");
console.log(chalk.bold(" Configuration Initialisation"));
console.log(chalk.gray.italic(" by NXD | Marco Rensch"));
console.log("###############################################\n");

const rl = readline.createInterface({ input, output });
let doEnvConfig = await rl.question(chalk.bold.red("Attention: ") + ' This Script creates new secrets for the .env file. Stored user credentials will not work anymore when proceeding.\nDo you want to continue? ('+chalk.italic.cyan('press "y" to continue or any key to skip')+') ');
if(doEnvConfig.toLowerCase() === 'y') {

    let doBackup = await rl.question('Do you want to create a Backup of your existing .env file? (' + chalk.italic.cyan('press "y" to create a backup or any key to skip') + ') ');
    if (doBackup === 'y') {
        let backupName = await rl.question('Please enter a name for the backup file: ');
        if (!backupName.endsWith('.env')) {
            backupName += '.env';
        }

        if (fs.existsSync(pathToEnv)) {
            fs.copyFile(pathToEnv, backupName, (err) => {
                if (err) throw err;
                console.log(chalk.bold.green('Backup created successfully'));
            });
        } else {
            console.log(chalk.bold.yellow('No .env file found. Skipping backup...'));
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

    for (const [id, object] of Object.entries(configuration)) {
        if (object.value == null) {
            object.value = await rl.question('Please enter a value for ' + chalk.bold.blue(object.key) + ': ');
        }
    }


    const configString = Object.keys(configuration).map(key => `${configuration[key].key}=${configuration[key].value}`).join('\n');
    try {
        fs.writeFileSync(pathToEnv, configString, {encoding: 'utf8'});
        console.log('\n-----------------------------------------------------------------------------');
        console.log(chalk.green.bold('The configuration file has been saved!'));
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
} else {
    console.log(chalk.bold.yellow('Skipping Configuration...'));

    if (fs.existsSync(pathToEnv)) {
        console.log(chalk.bold.yellow('Found existing .env file...'));
        // Loading config from evn file
        const envConfig = dotenv.parse(fs.readFileSync(pathToEnv));
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

const installDb = await rl.question('Do you want to install the database? Please make sure your MariaDB or MySQL instance is running before proceed ('+chalk.italic.cyan('press "y" to install or any key to skip')+') ');

if(installDb === 'y'){

    let connectionData = {
        host: configuration.db_host.value,
        port: configuration.db_port.value,
        user: configuration.db_user.value,
        password: configuration.db_password.value,
        database: configuration.db_name.value,
    }

    const removeDb = await rl.question('Do you want to remove the existing database? ('+chalk.italic.cyan('press "y" to remove or any key to skip')+') ');
    if(removeDb === 'y'){
        console.log('Try to remove existing Database...');
        const status = await dropDatabase(connectionData);
        if(status){
            console.log(chalk.bold.green('Database removed successfully'));
        }else{
            console.log(chalk.bold.yellow('Error removing database, the database may not exist'));
        }
    }

    try {
        const status = await create(connectionData);
    } catch (err) {
        console.log(chalk.bold.red('Error creating Database'));
        console.log(err);
    }
}

const addAdmin = await rl.question('Do you want to create an admin user? ('+chalk.italic.cyan('press "y" to create or any key to skip')+') ');

if(addAdmin === 'y'){

    let connectionData = {
        host: configuration.db_host.value,
        port: configuration.db_port.value,
        user: configuration.db_user.value,
        password: configuration.db_password.value,
        database: configuration.db_name.value,
    }

    let username = await rl.question('Please enter a username for the admin user:');
    let password = await rl.question('Please enter a password for the admin user:');
    let email = await rl.question('Please enter a email for the admin user:');

    const admin = new User("","",username,email);
    admin.setPassword(password, false);

    const result = await addAdminUser(connectionData, admin);
    console.log(result);
}

rl.close();

console.log("\n\n")
console.log("###############################################");
console.log(chalk.bold("Thank you, Have a nice day!"));
console.log("###############################################");
console.log("\n\n")

process.exit(0);
