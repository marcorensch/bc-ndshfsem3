import isLength from "validator/lib/isLength.js";
import isEmail from "validator/lib/isEmail.js";
import User from "../model/User.mjs";
import ApiError from "../model/ApiError.mjs";

const registrationValidator = (req, res, next) => {

    let {firstname, lastname, username, password, email} = req.body;

    console.log("Registration validator: ", req.body);

    firstname = firstname.trim();
    lastname = lastname.trim();
    username = username.trim();
    email = email.trim();

    const regex = /^([a-z.\-_])*$/i;

    if(!regex.test(username)) return res.status(400).json(new ApiError('u-320', "Forbidden characters found", "username").setData({value: username}));
    if(!regex.test(firstname)) return res.status(400).json(new ApiError('u-320', "Forbidden characters found", "firstname").setData({value: firstname}));
    if(!regex.test(lastname)) return res.status(400).json(new ApiError('u-320', "Forbidden characters found", "lastname").setData({value: lastname}));

    if(!isEmail(email)) return res.status(400).json(new ApiError('u-318', "Invalid Email", "email"));

    if(!isLength(username, {min: 3, max: 20})) return res.status(400).json(new ApiError('u-319', "Invalid length", "username"));
    if(!isLength(firstname, {min: 3, max: 20})) return res.status(400).json(new ApiError('u-319', "Invalid length", "firstname"));
    if(!isLength(lastname, {min: 3, max: 20})) return res.status(400).json(new ApiError('u-319', "Invalid length", "lastname"));
    if(!isLength(password, {min: 8, max: 20})) return res.status(400).json(new ApiError('u-319', "Invalid length", "password"));

    const user = new User(firstname, lastname, username, email);
    user.setPassword(password, false);

    console.log("User data: ", user);

    req.user = user;
    next();

}

const loginValidator = (req, res, next) => {
    console.log("Login validator NOT YET IMPLEMENTED");
    next();
}

export {registrationValidator, loginValidator};