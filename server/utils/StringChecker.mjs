import ApiError from "../model/ApiError.mjs";
import isLength from "validator/lib/isLength.js";

export default class StringChecker{
    username;
    firstname;
    lastname;
    password;

    constructor() {
        this.username = {
            regex : /^([a-z]+[.\-_]*[a-z]+)$/,
            min: 3,
            max: 20,
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

    isValid(string, context) {
        const lengthTest = this.hasValidLength(string, this[context].min, this[context].max);
        const regexTest = this[context].regex.test(string);

        if(!lengthTest) return new ApiError('u-319', "Invalid length", context).setData({value: this[context].returnValue ? string : false});
        if(!regexTest) return new ApiError('u-320', "Forbidden characters found", context).setData({value: this[context].returnValue ? string : false})

        return true;
    }


    hasValidLength(string, min, max){
        return isLength(string, {min, max});
    }
}

/*
-------------- REGEX Tests --------------

Username: https://regex101.com/r/fnzAZJ/1

 */