import express from "express";
const router = express.Router();
// Import Demo Questions @ToDo: Remove this after db implementation
import questions from "../demo/questions.mjs";

router.get('/', (req, res) => {
    res.json(questions);
});

router.post('/create', (req, res) => {
    // Add a new Question to db
    console.log("Create Question");
    console.log(req.body);
    const newQuestion = { id: new Date().toString(), question: req.body.question, user_id: req.body.user_id };
    questions.push(newQuestion);
    res.json({ message: 'Question created!' });
});

router.post('/update', (req, res) => {
    // Update a Question in db
    console.log("Update a Question");
    console.log(req.body);
});

router.delete('/delete', (req, res) => {
    // Delete a Question from db
    console.log("Delete a Question");
    console.log(req.body);
});

router.post('/answer', (req, res) => {
    // Answer a Question
    console.log("Answer a Question");
    console.log(req.body);
});

router.get('/get', (req, res) => {
    // Get a Question and its answers
    console.log("Get a Question and its answers from database");
    console.log(req.body);
});

export default router;