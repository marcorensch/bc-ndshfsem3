import express from "express";
import ApiError from "../model/ApiError.mjs";
import {registrationValidator} from "../middleware/formValidator.mjs";

import UserController from "../controller/UserController.mjs";
import formSanitizer from "../middleware/formSanitizer.mjs";

const router = express.Router();


// Do work here

router.get('/', (req, res) => {
    res.json(users);
});

router.post('/register', formSanitizer, registrationValidator, async (req, res) => {
    console.log("User data received: ", req.user);

    const userController = new UserController();
    const result = await userController.registerUser(req.user);

    if(result.success && result.data.affectedRows === 1) {
        res.status(201).json({
            message: "User registered successfully"
        });
    }else{
        let errData = {};
        if(result.data.code === "ER_DUP_ENTRY"){
            const column = result.data.message.split("for key")[1].split("'")[1];
            errData = new ApiError('u-321', "Username already exists", column);
        }else{
            errData = new ApiError('e-999', "Unknown Error");
            console.error("Unknown error while registering User:", result.data);
        }
        res.status(409).json(errData);
    }
});

export default router;

