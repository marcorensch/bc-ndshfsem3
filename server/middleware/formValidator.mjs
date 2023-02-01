import User from "../model/User.mjs";
import FieldChecker from "../utils/FieldChecker.mjs";
import UserHelper from "../helper/UserHelper.mjs";
import ApiError from "../model/ApiError.mjs";

const registrationValidator = async (req, res, next) => {
    const fieldChecker = new FieldChecker();
    let {firstname, lastname, username, email} = req.body;
    let password = req.body.password

    for(let [context, value] of Object.entries({firstname, lastname, username, password, email})){
        const result = await fieldChecker.isValid(value.trim(), context)
        if(result !== true){
            return res.status(400).json(result);
        }
    }

    const user = new User(firstname, lastname, username, email);
    user.setPassword(password, false);

    req.user = user;
    next();
}

const userUpdateValidator = async (req, res, next) => {
    const fieldChecker = new FieldChecker();
    let {firstname, lastname, username, email} = req.body;

    for(let [context, value] of Object.entries({firstname, lastname, username, email})){
        if(value === req.user[context]) continue;
        const result = await fieldChecker.isValid(value.trim(), context)
        if(result !== true){
            return res.status(400).json(result);
        }
    }
    next();
}

const loginValidator = async (req, res, next) => {
    let {username, password} = req.body;
    const userHelper = new UserHelper();
    const user = await userHelper.getUserByUsername(username);

    if(!user) return res.status(400).json(new ApiError('u-331'));
    if(!user.checkPassword(password)) return res.status(401).json(new ApiError('u-332'));

    req.user = user;
    next();
}

export { registrationValidator, loginValidator, userUpdateValidator };