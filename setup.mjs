import * as crypto from "crypto";
import * as fs from 'fs';
import chalk from 'chalk';
import mariadb from 'mariadb';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

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
for (let i = 0; i < 20; i++) {
    console.log("\n")
}

const pathToEnv = './server/.env';

console.log("###############################################");
console.log(chalk.bold(" Configuration Initialisation"));
console.log(chalk.gray.italic(" by NXD | Marco Rensch"));
console.log("###############################################\n");

const rl = readline.createInterface({ input, output });
let answer = await rl.question(chalk.bold.red("Attention: ") + ' This Script creates new secrets for the .env file. Stored user credentials will not work anymore when proceeding.\nDo you want to continue? ('+chalk.italic.cyan('press "n" to abort or any key to continue')+') ');
if(answer === 'n'){
    console.log('Aborting...');
    process.exit(0);
}
let doBackup = await rl.question( 'Do you want to create a Backup of your existing .env file? ('+chalk.italic.cyan('press "y" to create a backup or any key to continue')+') ');
if(doBackup === 'y'){
    let backupName = await rl.question('Please enter a name for the backup file: ');
    if(!backupName.endsWith('.env')){
        backupName += '.env';
    }

    if(fs.existsSync('.env')){
        fs.copyFile(pathToEnv, backupName, (err) => {
            if (err) throw err;
            console.log(chalk.bold.green('Backup created successfully'));
        });
    }else{
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
    if(object.value == null) {
        object.value = await rl.question('Please enter a value for ' + chalk.bold.blue(object.key) + ': ');
    }
}


const configString = Object.keys(configuration).map(key => `${configuration[key].key}=${configuration[key].value}`).join('\n');
try{
    fs.writeFileSync(pathToEnv, configString, { encoding: 'utf8' });
    console.log('\n-----------------------------------------------------------------------------');
    console.log(chalk.green.bold('The configuration file has been saved!'));
    console.log(chalk.bold('Note:') + '\nYou can change the configuration at any time by editing the .env file.');
    console.log(chalk.bold.yellow('\nNEW SECRET TOKENS WHERE CREATED - SECRETS SHOULD NOT BE SHARED WITH ANYONE!'));
    console.log("\nPlease make sure your Database is running and the credentials are correct.");
    console.log("You can now using " + chalk.bold("npm run devStart") + " to start your server.");
    console.log('-----------------------------------------------------------------------------\n');
}catch (err) {
    console.log(chalk.bold.red('Error writing configuration file'));
    console.log("Configuration File not created");
    console.log(err);
    process.exit(1);
}

const installDb = await rl.question('Do you want to install the database? ('+chalk.italic.cyan('press "y" to install or any key to skip')+') ');
rl.close();
if(installDb === 'y'){

    console.log(chalk.bold.yellow('Sorry this feature is not implemented yet. Please install the database manually.'));

}


console.log("\n\n")
console.log("###############################################");
console.log(chalk.bold("Thank you, Have a nice day!"));
console.log("###############################################");
console.log("\n\n")
