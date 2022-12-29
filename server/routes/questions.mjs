import express from "express";
const router = express.Router();
import {authenticateToken} from "../middleware/authenticate.mjs";
import Question from "../model/Question.mjs";
import questionSanitizer from "../middleware/questionSanitizer.mjs";
import QuestionController from "../controller/QuestionController.mjs";
import ApiError from "../model/ApiError.mjs";
import questionChecker from "../middleware/questionChecker.mjs";
import userController from "../controller/UserController.mjs";

router.get('/', async (req, res) => {
    const {count, offset, user_id, category_id, direction} = req.query;
    const queryParams = {
        count: count || 25,
        offset: offset || 0,
        user_id: user_id || false,
        category_id: category_id || false,
        direction: direction || "DESC"
    }
    const questionController = new QuestionController();
    const result = await questionController.getItems(queryParams);
    res.status(200).json(result);
});

router.post('/create', authenticateToken, questionSanitizer, questionChecker,  async (req, res) => {
    let {content, category_id, anonymous} = req.body;
    console.log("Question data received: ", req.body);
    const userId = req.user.id;
    const userController = new userController();
    const user = await userController.getUserById(userId);

    // Add a new Question to db
    console.log("Create Question");
    console.log(req.body);
    const question = new Question(content, userId).setAnonymous(anonymous).setCategoryId(category_id);

    try{
        const questionController = new QuestionController();
        await questionController.storeItem(question);
        const insertedQuestionId = await questionController.getLastItemIdCreatedByUserId(userId)

        res.status(201).json({
            message: "Question created successfully",
            question_id: insertedQuestionId,
            user_id: user.id,
            is_admin: user.isAdministrator,
            token: req.token
        });
    }catch (error) {
        console.error(error);
        if(error.errno === 1452) res.status(422).json(new ApiError('c-331'));
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

router.get('/:id', (req, res) => {
    // Get a Question and its answers
    console.log("Get a Question and its answers from database");
    console.log(req.body);
});

export default router;