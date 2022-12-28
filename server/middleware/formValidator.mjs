import User from "../model/User.mjs";
import FieldChecker from "../utils/FieldChecker.mjs";
import UserController from "../controller/UserController.mjs";
import ApiError from "../model/ApiError.mjs";

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

const loginValidator = async (req, res, next) => {
    console.log("login validator called");
    let {username, password} = req.body;
    const userController = new UserController();

    const dbResult = await userController.getUserByUsername(username);

    if(!dbResult.success) return res.status(500).json(dbResult.data);
    if(dbResult.data.length !== 1) return res.status(400).json(new ApiError('u-331'));

    const user = new User(dbResult.data[0].firstname, dbResult.data[0].lastname, dbResult.data[0].username, dbResult.data[0].email);
    user.setId(dbResult.data[0].id);
    user.setPassword(dbResult.data[0].password, true);

    console.log("user", user);

    console.log("password",password)

    // const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log("passwordMatch", passwordMatch);

    if(!user.checkPassword(password)) return res.status(400).json(new ApiError('u-332'));

    req.user = user;

    next();
}

export {registrationValidator, loginValidator};