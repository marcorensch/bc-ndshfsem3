import isLength from "validator/lib/isLength.js";
import isEmail from "validator/lib/isEmail.js";
import User from "../model/User.mjs";
import ApiError from "../model/ApiError.mjs";
import FieldChecker from "../utils/FieldChecker.mjs";

const registrationValidator = (req, res, next) => {

    let {firstname, lastname, username, password, email} = req.body;
    const fieldChecker = new FieldChecker();

    for(let [context, value] of Object.entries({firstname, lastname, username, password, email})){
        const result = fieldChecker.isValid(value.trim(), context)
        if(result !== true){
            return res.status(400).json(result);
        }
    }

    const user = new User(firstname, lastname, username, email);
    user.setPassword(password, false);

    req.user = user;
    next();
}

const loginValidator = (req, res, next) => {
    console.log("Login validator NOT YET IMPLEMENTED");
    next();
}

export {registrationValidator, loginValidator};