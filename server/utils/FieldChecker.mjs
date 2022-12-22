import ApiError from "../model/ApiError.mjs";
import isLength from "validator/lib/isLength.js";
import isEmail from "validator/lib/isEmail.js";
import {forbiddenList} from "./BadWords.mjs";
import UserController from "../controller/UserController.mjs";

export default class FieldChecker {
    username;
    firstname;
    lastname;
    password;
    connectionData;

    constructor(connectionData = false) {
        this.connectionData = connectionData;
        this.username = {
            regex : /^([a-z]+[.\-_]*[a-z]+)$/,
            min: 3,
            max: 20,
            forbidden: forbiddenList(),
            returnValue: true
        };
        this.firstname = {
            regex : /^([a-z]+([\-\t ]*[a-z])+)$/i,
            min: 3,
            max: 20,
            returnValue: true
        };
        this.lastname = this.firstname;
        this.password = {
            regex: /^([a-z.\-_!?\d])*$/i,
            min: 8,
            max: 20,
            returnValue: false
        };
    }

    isValid(string, context){
        if(!string) return new ApiError('u-317', "Missing field", context);
        return context === "email" ? this.isValidEmail(string) : this.isValidString(string, context);
    }

    async isValidEmail(email){
        const validEmailTest = isEmail(email) ? true : new ApiError('u-323', "Invalid email", "email").setData({value: email});
        const isNewEmailTest = await this.emailIsNew(email) ? true : new ApiError('u-321', "Email already taken", "email").setData({value: email});

        if(!validEmailTest) return validEmailTest;
        if(!isNewEmailTest) return isNewEmailTest;

        return true;
    }

    isValidString(string, context) {
        const lengthTest = this.hasValidLength(string, this[context].min, this[context].max);
        const regexTest = this[context].regex.test(string);
        const forbiddenWordTest = context !== "password" ? this.stringContainsForbiddenWord(string) : true;

        if(!lengthTest) return new ApiError('u-319', "Invalid length", context).setData({value: this[context].returnValue ? string : false});
        if(!regexTest) return new ApiError('u-320', "Forbidden characters found", context).setData({value: this[context].returnValue ? string : false})
        if(!forbiddenWordTest.status) return new ApiError('u-321', "Forbidden word found", context).setData({value: this[context].returnValue ? forbiddenWordTest.word : false});

        return true;
    }

    async isValidUsername(username){
        const isValidStringTest = this.isValidString(username, "username");
        const isAvailableTest = await this.usernameIsAvailable(username);
        if(!isAvailableTest) return new ApiError('u-322', "Username already taken", "username").setData({value: this.username.returnValue ? username : false});

        return isValidStringTest;
    }

    async usernameIsAvailable(username){
        return true;
        const userController = new UserController(this.connectionData);
        const userId = await userController.getUserIdByUsername(username);
        return !userId;
    }

    stringContainsForbiddenWord(string){
        let testedWord = "";
        const forbidden = this.username.forbidden.some((word) => {
            if(string.toLowerCase().includes(word)){
                testedWord = word;
                return true;
            }
        });
        return forbidden ? {status: false, word: testedWord} : {status: true};
    }

    async emailIsNew(email){
        const userController = new UserController(this.connectionData);
        const userId = await userController.getUserIdByEmail(email);
        return !userId;
    }

    hasValidLength(string, min, max){
        return isLength(string, {min, max});
    }
}