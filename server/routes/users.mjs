import express from "express";

const router = express.Router();

import users from "../demo/users.mjs";

// Do work here

router.get('/', (req, res) => {
    res.json(users);
});

router.get('/:id', (req, res) => {
    console.log("Get Data of User with ID: ", req.params.id);
    const user = users.find(user => user.id === parseInt(req.params.id));
    res.json(user);
});

export default router;

