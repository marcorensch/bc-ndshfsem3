import express from "express";
const router = express.Router();
// Import Demo Questions @ToDo: Remove this after db implementation
import questions from "../demo/questions.mjs";
import {authenticateToken} from "../middleware/authenticate.mjs";
import Question from "../model/Question.mjs";
import question from "../model/Question.mjs";
import questionSanitizer from "../middleware/questionSanitizer.mjs";
import QuestionController from "../controller/QuestionController.mjs";

router.get('/', (req, res) => {
    res.json(questions);
});

router.post('/create', authenticateToken, questionSanitizer,  async (req, res) => {
    let {content, category_id, anonymous} = req.body;
    const userId = req.user.id;
    // Add a new Question to db
    console.log("Create Question");
    console.log(req.body);
    const question = new Question(content, userId).setAnonymous(anonymous).setCategoryId(category_id);

    try{
        const questionController = new QuestionController();
        await questionController.storeQuestion(question);
        const insertedQuestionId = await questionController.getLastQuestionIdFromUser(userId)
        res.status(201).json({
            message: "Question created successfully",
            question_id: insertedQuestionId
        });
    }catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
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