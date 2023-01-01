import express from "express";
import identifyCurrentUser from "../middleware/identifyCurrentUser.mjs";
import {authenticateToken} from "../middleware/authenticate.mjs";
import UserHelper from "../helper/UserHelper.mjs";
import TransportObject from "../model/TransportObject.mjs";

const router = express.Router();

// Do work here

router.get('/', authenticateToken, async (req, res) => {
    const userHelper = new UserHelper();
    try{
        const users = await userHelper.getAllUsers();
        const transportObject = new TransportObject().setPayload({users, token: req.token, user_id: req.user.id});
        res.status(200).json(transportObject);
    }catch (e) {
        console.error(e);
    }
});

router.get('/:id', (req, res) => {
    console.log("Get Data of User with ID: ", req.params.id);
    const user = users.find(user => user.id === parseInt(req.params.id));
    res.json(user);
});

export default router;

