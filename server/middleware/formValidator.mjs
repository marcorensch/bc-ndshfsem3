import User from "../model/User.mjs";
import FieldChecker from "../utils/FieldChecker.mjs";

const registrationValidator = async (req, res, next) => {

    let {firstname, lastname, username, password, email} = req.body;
    const fieldChecker = new FieldChecker();

    for(let [context, value] of Object.entries({firstname, lastname, username, password, email})){
        const result = await fieldChecker.isValid(value.trim(), context)
        console.log(context, result);
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