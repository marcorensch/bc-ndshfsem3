import express from "express";
import identifyCurrentUser from "../middleware/identifyCurrentUser.mjs";
import {authenticateToken, authenticateUser} from "../middleware/authenticate.mjs";
import UserHelper from "../helper/UserHelper.mjs";
import TransportObject from "../model/TransportObject.mjs";
import ApiError from "../model/ApiError.mjs";

const router = express.Router();

// Do work here

router.get('/', authenticateToken, authenticateUser, async (req, res) => {
    if(!req.user.isadministrator) return res.status(403).json(new ApiError("e-100"));
    const userHelper = new UserHelper();
    try{
        const users = await userHelper.getAllUsers();
        const transportObject = new TransportObject().setPayload({users, token: req.token, user_id: req.user.id});
        res.status(200).json(transportObject);
    }catch (e) {
        console.error(e);
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    if(!req.user.isadministrator) return res.status(403).json(new ApiError("e-100"));
    if(!req.params.id) return res.status(422).json(new ApiError("u-317").relatedColumn("id"));

    const userHelper = new UserHelper();
    try{
        const result = await userHelper.deleteUserById(req.params.id);
        if(result.success && result.data.affectedRows === 1) {
            const transportObject = new TransportObject().setPayload({token: req.token, user_id: req.user.id});
            res.status(200).json(transportObject);
        }
    }catch (e) {
        console.error(e);
        res.status(500).json(new ApiError('e-999'));
    }
});

router.get('/:id', (req, res) => {
    console.log("Get Data of User with ID: ", req.params.id);
    const user = users.find(user => user.id === parseInt(req.params.id));
    res.json(user);
});

export default router;

