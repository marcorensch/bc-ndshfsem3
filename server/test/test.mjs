import * as assert from "assert";
import StringChecker from "../utils/StringChecker.mjs";
import ApiError from "../model/ApiError.mjs";

describe('StringChecker', function () {
    const stringChecker = new StringChecker();
    describe('Username Check', function () {
        it('should return ApiError Code u-319 if two characters long', function () {
            const check = stringChecker.isValid("ab", "username");
            assert.equal(check.errorCode, "u-319");
        });

        it('should return true for Username "myusername"', function () {
            assert.equal(stringChecker.isValid("myusername", "username"), true);
        });

        it('should return ApiError u-320 for Username "-myusername"', function () {
            const check = stringChecker.isValid("-myusername", "username");
            console.log(check);
            assert.equal(check.errorCode, "u-320");
        });

        it('should return ApiError u-320 for Username "myusername-"', function () {
            const check = stringChecker.isValid("myusername-", "username");
            console.log(check);
            assert.equal(check.errorCode, "u-320");
        });

        it('should return value "user<>name" in ApiError u-320 for Username "user<>name"', function () {
            const check = stringChecker.isValid("user<>name", "username");
            console.log(check);
            assert.equal(check.errorCode, "u-320");
            assert.equal(check.data.value, "user<>name");
        });
    });
    describe('Password Check', function () {
        it('should return value false in ApiError u-320 for Password "ab123><grapefruit"', function () {
            const check = stringChecker.isValid("ab123><grapefruit", "password");
            console.log(check);
            assert.equal(check.data.value, false);
        });

        it('should return ApiError u-319 for Password "ab123"', function () {
            const check = stringChecker.isValid("ab123", "password");
            console.log(check);
            assert.equal(check.errorCode, "u-319");
        });

        it('should return ApiError u-320 for Password "ab123><grapefruit"', function () {
            const check = stringChecker.isValid("ab123><grapefruit", "password");
            console.log(check);
            assert.equal(check.errorCode, "u-320");
        });
    });
    describe('Firstname Check', function () {
        it('should return ApiError Code u-319 if two characters long', function () {
            const check = stringChecker.isValid("ab", "firstname");
            assert.equal(check.errorCode, "u-319");
        });
        it('should return ApiError Code u-319 if twenty-one characters long', function () {
            const check = stringChecker.isValid("abcdefghijklmnopqrstu", "firstname");
            assert.equal(check.errorCode, "u-319");
        });
        it('should return ApiError Code u-320 for "-Firstname"', function () {
            const check = stringChecker.isValid("-Firstname", "firstname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return ApiError Code u-320 for "Firstname-"', function () {
            const check = stringChecker.isValid("Firstname-", "firstname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return ApiError Code u-320 for "-Firstname-"', function () {
            const check = stringChecker.isValid("-Firstname-", "firstname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return true for "Hans Joachim"', function () {
            const check = stringChecker.isValid("Hans Joachim", "firstname");
            assert.equal(check, true);
        });
        it('should return true for "Hans-Joachim"', function () {
            const check = stringChecker.isValid("Hans-Joachim", "firstname");
            assert.equal(check, true);
        });
        it('should return true for "Hans - Joachim"', function () {
            const check = stringChecker.isValid("Hans - Joachim", "firstname");
            assert.equal(check, true);
        });
    });
    describe('Lastname Check', function () {
        it('should return ApiError Code u-319 if two characters long', function () {
            const check = stringChecker.isValid("ab", "lastname");
            assert.equal(check.errorCode, "u-319");
        });
        it('should return ApiError Code u-319 if twenty-one characters long', function () {
            const check = stringChecker.isValid("abcdefghijklmnopqrstu", "lastname");
            assert.equal(check.errorCode, "u-319");
        });
        it('should return ApiError Code u-320 for "-Lastname"', function () {
            const check = stringChecker.isValid("-Lastname", "lastname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return ApiError Code u-320 for "Lastname-"', function () {
            const check = stringChecker.isValid("Lastname-", "lastname");
            assert.equal(check.errorCode, "u-320");
        });
        it('should return ApiError Code u-320 for "-Lastname-"', function () {
            const check = stringChecker.isValid("-Lastname-", "lastname");
            assert.equal(check.errorCode, "u-320");
        });
    });
});

/*

 */