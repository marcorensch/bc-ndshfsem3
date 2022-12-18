import express from "express";

const router = express.Router();


// Do work here

router.get('/', (req, res) => {
    res.json(users);
});

router.post('/register', (req, res) => {
    console.log("User data received: ", req.body);
    res.json({
        message: "User registered successfully"
    });
});

export default router;

