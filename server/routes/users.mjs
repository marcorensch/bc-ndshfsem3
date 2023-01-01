import express from "express";
import identifyCurrentUser from "../middleware/identifyCurrentUser.mjs";
import {authenticateToken} from "../middleware/authenticate.mjs";

const router = express.Router();

// Do work here

router.get('/', authenticateToken, (req, res) => {
    console.log("DRIN")
});

router.get('/:id', (req, res) => {
    console.log("Get Data of User with ID: ", req.params.id);
    const user = users.find(user => user.id === parseInt(req.params.id));
    res.json(user);
});

export default router;

