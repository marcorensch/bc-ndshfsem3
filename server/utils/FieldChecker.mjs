import ApiError from "../model/ApiError.mjs";
import isLength from "validator/lib/isLength.js";
import isEmail from "validator/lib/isEmail.js";
import {forbiddenList} from "./BadWords.mjs";
import UserHelper from "../helper/UserHelper.mjs";

export default class FieldChecker {
    username;
    firstname;
    lastname;
    password;
    connectionData;
    question;
    answer;

    constructor(connectionData) {
        this.connectionData = connectionData;
        this.tags = {
            forbidden: forbiddenList,
        };
        this.question = {
            min: 20,
            max: 100000
        };
        this.answer = {
            min: 20,
            max: 10000
        };
        this.username = {
            regex : /^([a-z]+[.\-_]*[a-z]+)$/i,
            min: 3,
            max: 20,
            forbidden: forbiddenList(),
            returnValue: true
        };
        this.firstname = {
            regex : /^([\p{Letter}\p{Mark}]+[\-\t ]*[\p{Letter}\p{Mark}]+)$/iu, // https://dev.to/tillsanders/let-s-stop-using-a-za-z-4a0m
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
    async isValid(string, context){
        if(!string) return new ApiError('u-317', context);
        return context === "email" ? await this.isValidEmail(string) : this.isValidString(string, context);
    }
    async isValidEmail(email){
        if(!isEmail(email)) return new ApiError('u-318', "email").setData({value: email});
        if(!await this.emailIsNew(email)) return new ApiError('u-322', "email").setData({value: email});

        return true;
    }
    isValidString(string, context) {
        const lengthTest = this.hasValidLength(string, this[context].min, this[context].max);
        const regexTest = this[context].regex.test(string);
        const forbiddenWordTest = context !== "password" ? this.stringContainsForbiddenWord(string) : {status: true};

        if(!lengthTest) return new ApiError('u-319', context).setData({value: this[context].returnValue ? string : false});
        if(!regexTest) return new ApiError('u-320', context).setData({value: this[context].returnValue ? string : false})
        if(!forbiddenWordTest.status) return new ApiError('u-321', context).setData({value: this[context].returnValue ? forbiddenWordTest.word : false});

        return true;
    }
    async isValidUsername(username){
        const isValidStringTest = this.isValidString(username, "username");
        const isAvailableTest = await this.usernameIsAvailable(username);
        if(!isAvailableTest) return new ApiError('u-322', "username").setData({value: this.username.returnValue ? username : false});

        return isValidStringTest;
    }
    async usernameIsAvailable(username){
        const userHelper = new UserHelper(this.connectionData);
        const result = await userHelper.getUserIdByUsername(username);
        return result.data.length === 0;
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
        const userHelper = new UserHelper(this.connectionData);
        const result = await userHelper.getUserIdByEmail(email);
        return !!!result.data[0]?.id
    }
    hasValidLength(string, min, max){
        return isLength(string, {min, max});
    }
    setBoolean(value) {
        if(typeof value == "string") return value === "1" || value === "true";
        if(typeof value == "boolean") return value;
        return value === 1;
    }
    checkTags(tags){
        let checkedTags = [];
        for (const tag of tags) {
            if(!this.tags.forbidden().includes(tag)) checkedTags.push(tag);
        }
        return checkedTags;
    }
}