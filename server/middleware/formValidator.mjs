import User from "../model/User.mjs";
import FieldChecker from "../utils/FieldChecker.mjs";
import UserHelper from "../helper/UserHelper.mjs";
import ApiError from "../model/ApiError.mjs";

const registrationValidator = async (req, res, next) => {

    let {firstname, lastname, username, password, email} = req.body;
    const fieldChecker = new FieldChecker();

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

const loginValidator = async (req, res, next) => {
    let {username, password} = req.body;
    const userHelper = new UserHelper();

    const user = await userHelper.getUserByUsername(username);

    if(!user) return res.status(400).json(new ApiError('u-331'));
    if(!user.checkPassword(password)) return res.status(401).json(new ApiError('u-332'));

    req.user = user;

    next();
}

export {registrationValidator, loginValidator};