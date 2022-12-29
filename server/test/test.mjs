import * as assert from "assert";
import FieldChecker from "../utils/FieldChecker.mjs";
import * as dotenv  from 'dotenv';
import User from "../model/User.mjs";
import UserHelper from "../helper/UserHelper.mjs";
dotenv.config();

const testDbConnectionData = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME+'_test',
}

describe('String Checker', function () {
    const fieldChecker = new FieldChecker();
    describe('Username Check', async function () {
        it('should return ApiError Code u-319 if two characters long', async function () {
            const check = await fieldChecker.isValidUsername("ab");
            assert.equal(check.errorCode, "u-319");
        });

        it('should return true for Username "vorname.nachname"', async function () {
            assert.equal(await fieldChecker.isValidUsername("vorname.nachname"), true);
        });

        it('should return ApiError u-321 for Username "myusername"', async function () {
            const check = await fieldChecker.isValidUsername("myusername")
            assert.equal(check.errorCode, "u-321");
        });

        it('should return ApiError u-320 for Username "-myusername"', async function () {
            const check = await fieldChecker.isValidUsername("-myusername");
            console.log(check);
            assert.equal(check.errorCode, "u-320");
        });

        it('should return ApiError u-320 for Username "myusername-"', async function () {
            const check = await fieldChecker.isValidUsername("myusername-");
            console.log(check);
            assert.equal(check.errorCode, "u-320");
        });

        it('should return value "user<>name" in ApiError u-320 for Username "user<>name"', async function () {
            const check = await fieldChecker.isValidUsername("user<>name");
            console.log(check);
            assert.equal(check.errorCode, "u-320");
            assert.equal(check.data.value, "user<>name");
        });
    });
    describe('Password Check', function () {
        it('should return value false in ApiError u-320 for Password "ab123><grapefruit"', function () {
            const check = fieldChecker.isValidString("ab123><grapefruit", "password");
            console.log(check);
            assert.equal(check.data.value, false);
        });

        it('should return ApiError u-319 for Password "ab123"', function () {
            const check = fieldChecker.isValidString("ab123", "password");
            console.log(check);
            assert.equal(check.errorCode, "u-319");
        });

        it('should return ApiError u-320 for Password "ab123><grapefruit"', function () {
            const check = fieldChecker.isValidString("ab123><grapefruit", "password");
            console.log(check);
            assert.equal(check.errorCode, "u-320");
        });
    });
    describe('Firstname Check', function () {
        it('should return ApiError Code u-319 if two characters long', function () {
            const check = fieldChecker.isValidString("ab", "firstname");
            assert.equal(check.errorCode, "u-319");
        });
        it('should return ApiError Code u-319 if twenty-one characters long', function () {
            const check = fieldChecker.isValidString("abcdefghijklmnopqrstu", "firstname");
            assert.equal(check.errorCode, "u-319");
        });
        it('should return ApiError Code u-320 for "-Firstname"', function () {
            const check = fieldChecker.isValidString("-Firstname", "firstname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return ApiError Code u-320 for "Firstname-"', function () {
            const check = fieldChecker.isValidString("Firstname-", "firstname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return ApiError Code u-320 for "-Firstname-"', function () {
            const check = fieldChecker.isValidString("-Firstname-", "firstname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return true for "Hans Joachim"', function () {
            const check = fieldChecker.isValidString("Hans Joachim", "firstname");
            assert.equal(check, true);
        });
        it('should return true for "Hans-Joachim"', function () {
            const check = fieldChecker.isValidString("Hans-Joachim", "firstname");
            assert.equal(check, true);
        });
        it('should return true for "Hans - Joachim"', function () {
            const check = fieldChecker.isValidString("Hans - Joachim", "firstname");
            assert.equal(check, true);
        });
    });
    describe('Lastname Check', function () {
        it('should return ApiError Code u-319 if two characters long', function () {
            const check = fieldChecker.isValidString("ab", "lastname");
            assert.equal(check.errorCode, "u-319");
        });
        it('should return ApiError Code u-319 if twenty-one characters long', function () {
            const check = fieldChecker.isValidString("abcdefghijklmnopqrstu", "lastname");
            assert.equal(check.errorCode, "u-319");
        });
        it('should return ApiError Code u-320 for "-Lastname"', function () {
            const check = fieldChecker.isValidString("-Lastname", "lastname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return ApiError Code u-320 for "Lastname-"', function () {
            const check = fieldChecker.isValidString("Lastname-", "lastname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return ApiError Code u-320 for "-Lastname-"', function () {
            const check = fieldChecker.isValidString("-Lastname-", "lastname");
            assert.equal(check.errorCode, "u-320");
        });
    });
});
describe('E-Mail Checker', function (){

    const fieldChecker = new FieldChecker(testDbConnectionData);

    it('should return ApiError Code u-318 for invalid email "invalidemail"', async function () {
        const check = await fieldChecker.isValidEmail("invalidemail");
        assert.equal(check.errorCode, "u-318");
    });
    it('should return ApiError Code u-318 for invalid email invalidemail@', async function () {
        const check = await fieldChecker.isValidEmail("invalidemail@");
        assert.equal(check.errorCode, "u-318");
    });
    it('should return ApiError Code u-318 for invalid email invalidemail@tld', async function () {
        const check = await fieldChecker.isValidEmail("invalidemail@tld");
        assert.equal(check.errorCode, "u-318");
    });
    it('should return true for valid email "user@tld.com"', async function () {
        const check = await fieldChecker.isValidEmail("user@tld.com");
        assert.equal(check, true);
    });
    it('should return true for valid email "user@tld.ch"', async function () {
        const check = await fieldChecker.isValidEmail("user@tld.ch");
        assert.equal(check, true);
    });
    it('should return true for valid email "user@tld.co.uk"', async function () {
        const check = await fieldChecker.isValidEmail("user@tld.co.uk");
        assert.equal(check, true);
    });
    it('should return true for valid email "user-name@tld.co.uk"', async function () {
        const check = await fieldChecker.isValidEmail("user-name@tld.co.uk");
        assert.equal(check, true);
    });
    it('should return true for valid email "user.name@tld.co.uk"', async function () {
        const check = await fieldChecker.isValidEmail("user.name@tld.co.uk");
        assert.equal(check, true);
    });
    it('should return ApiError u-322 for already registered email "user.name@tld.co.uk"', async function () {

        const userHelper = new UserHelper(testDbConnectionData);

        // Preflight: Delete / Create User
        await userHelper.deleteUserByUsername("test-user");
        const user = new User("Test","Test","test-user","user.name@tld.co.uk");
        user.setPassword("12345678");
        await userHelper.registerUser(user);

        // Do check
        const check = await fieldChecker.isValidEmail("user.name@tld.co.uk");

        // Postflight: Delete User
        await userHelper.deleteUserByUsername("test-user");

        assert.equal(check.errorCode, "u-322");

    });
});

describe('Registration Checker', function (){
    const userController = new UserHelper(testDbConnectionData);

    it('should store a new user with valid data in the db', async function () {
        // Preflight: Delete / Create User
        await userController.deleteUserByUsername("proximate");
        const user = new User("Marco","Rensch","proximate","marco.rensch@tld.com");
        user.setPassword("12345678");

        // Do check
        const checkRegistering = await userController.registerUser(user);
        const checkIsRegistered = await userController.getUserByUsername("proximate");
        assert.equal(checkRegistering.data.affectedRows, 1);
        assert.equal(checkIsRegistered.username, "proximate");

        // Postflight: Delete User
        await userController.deleteUserByUsername("proximate");
    });
})