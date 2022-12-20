import isLength from "validator/lib/isLength.js";
import isEmail from "validator/lib/isEmail.js";
import contains from "validator/lib/contains.js";
import User from "../model/User.mjs";

const registrationValidator = (req, res, next) => {

    let {firstname, lastname, username, password, email} = req.body;

    console.log("Registration validator: ", req.body);

    firstname = firstname.trim();
    lastname = lastname.trim();
    username = username.trim();
    email = email.trim();

    const forbiddenChars = ["!", "#", "$", "%", "^", "&", "*", "(", ")", "+", "=", "{", "}", "[", "]", "|", "\\", ":", ";", "'", "\"", "<", ">", ",", "?", "/", "`", "~"];

    if(contains(username, forbiddenChars)) return res.status(400).json({message: "Username contains forbidden characters"});
    if(contains(firstname, forbiddenChars)) return res.status(400).json({message: "Firstname contains forbidden characters"});
    if(contains(lastname, forbiddenChars)) return res.status(400).json({message: "Lastname contains forbidden characters"});
    if(contains(email, forbiddenChars)) return res.status(400).json({message: "E-Mail contains forbidden characters"});

    if(!isEmail(email)) return res.status(400).json({message: "Invalid email address"});

    if(!isLength(firstname, {min: 3, max: 20})) return res.status(400).json({message: "Firstname must be between 3 and 20 characters"});
    if(!isLength(lastname, {min: 3, max: 20})) return res.status(400).json({message: "Lastname must be between 3 and 20 characters"});
    if(!isLength(username, {min: 3, max: 20})) return res.status(400).json({message: "Username must be between 3 and 20 characters"});
    if(!isLength(password, {min: 8, max: 20})) return res.status(400).json({message: "Password must be between 8 and 20 characters"});

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