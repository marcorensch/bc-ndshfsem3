import express from "express";
import {authenticateToken} from "../middleware/authenticate.mjs";
import UserHelper from "../helper/UserHelper.mjs";
import TransportObject from "../model/TransportObject.mjs";
import ApiError from "../model/ApiError.mjs";
import User from "../model/User.mjs";

const router = express.Router();

// Do work here

router.get('/', authenticateToken, async (req, res) => {
    if (!req.user.isadministrator) return res.status(403).json(new ApiError("e-100"));
    const userHelper = new UserHelper();
    try {
        const users = await userHelper.getAllUsers();
        const transportObject = new TransportObject().setPayload({users, token: req.token, user_id: req.user.id});
        res.status(200).json(transportObject);
    } catch (e) {
        console.error(e);
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    if (!req.user.isadministrator) return res.status(403).json(new ApiError("e-100"));
    if (!req.params.id) return res.status(422).json(new ApiError("u-317").relatedColumn("id"));

    const userHelper = new UserHelper();
    try {
        const result = await userHelper.deleteUserById(req.params.id);
        if (result.success && result.data.affectedRows === 1) {
            const transportObject = new TransportObject().setPayload({token: req.token, user_id: req.user.id});
            res.status(200).json(transportObject);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json(new ApiError('e-999'));
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    const userHelper = new UserHelper();
    console.log("Get Data of User with ID: ", req.user.id);
    const statistics = await userHelper.getStatistics(req.user.id);
    const recent = await userHelper.getRecentActivities(req.user.id, 20);
    if (!statistics) return res.status(500).json(new ApiError('e-999'));
    const transportObject = new TransportObject().setSuccess(true).setMessage("User Data loaded!").setPayload({
        user: req.user,
        statistics,
        recent
    });
    res.status(200).json(transportObject);
});

router.post('/check', async (req, res) => {
    const {username, email} = req.body;
    if (!username && !email) return res.status(422).json(new ApiError("u-317").relatedColumn("username and email").setMessage("No username or email provided!"));
    const userHelper = new UserHelper();
    let exists = false;
    if (username) {
        const result = await userHelper.getUserIdByUsername(username);
        exists = !!result.data[0]?.id;
    }
    if (email) {
        const result = await userHelper.getUserIdByEmail(email);
        exists = !!result.data[0]?.id;
    }

    return res.status(200).json(new TransportObject().setPayload({exists}))
});

router.put('/me', authenticateToken, async (req, res) => {
    const userHelper = new UserHelper();
    const {username, firstname, lastname, email, password, usergroup} = req.body;
    let userData = await userHelper.getUserById(req.user.id);
    userData = {...userData, ...{username, firstname, lastname, email}};
    const user = new User(userData.firstname, userData.lastname, userData.username, userData.email);
    user.id = userData.id;
    user.status = userData.status;
    user.usergroup = userData.usergroup;
    if (password) user.setPassword(password, false);
    if (usergroup) user.usergroup = usergroup;

    const updated = await userHelper.updateUserData(user);
    if(updated) return res.status(200).json(new TransportObject().setSuccess(true).setMessage("User updated").setPayload({token: req.token}));

    return res.status(500).json(new ApiError('e-999'));
});

export default router;

