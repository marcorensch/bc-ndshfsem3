import express from "express";

const router = express.Router();
import {authenticateToken} from "../middleware/authenticate.mjs";
import Question from "../model/Question.mjs";
import questionSanitizer from "../middleware/questionSanitizer.mjs";
import QuestionHelper from "../helper/QuestionHelper.mjs";
import ApiError from "../model/ApiError.mjs";
import questionChecker from "../middleware/questionChecker.mjs";
import identifyCurrentUser from "../middleware/identifyCurrentUser.mjs";

router.get('/', identifyCurrentUser, async (req, res) => {
    const {count, offset, user_id, category_id, direction} = req.query;
    const queryParams = {
        count: count || 25,
        offset: offset || 0,
        user_id: user_id || false,
        category_id: category_id || false,
        direction: direction || "DESC"
    }
    const questionHelper = new QuestionHelper();
    let result = await questionHelper.getItems(queryParams);
    if (result.success) {
        result.userId = req.userId;
        result.isAdmin = req.isAdmin;
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
});

router.post('/create', authenticateToken, questionSanitizer, questionChecker, async (req, res) => {
    let {content, category_id, anonymous} = req.body;
    console.log("Question data received: ", req.body);

    // Add a new Question to db
    console.log("Create Question");
    console.log(req.body);
    const question = new Question(content, req.user.id).setAnonymous(anonymous).setCategoryId(category_id);

    try {
        const questionHelper = new QuestionHelper();
        await questionHelper.storeItem(question);
        const insertedQuestionId = await questionHelper.getLastItemIdCreatedByUserId(req.user.id)

        res.status(201).json({
            message: "Question created successfully",
            question_id: insertedQuestionId,
            user_id: req.user.id,
            is_admin: req.user.isadministrator,
            token: req.token
        });
    } catch (error) {
        console.error(error);
        if (error.errno === 1452) res.status(422).json(new ApiError('c-331'));
        res.status(500).json(error);
    }
});

router.put('/:id', identifyCurrentUser, authenticateToken, questionSanitizer, questionChecker, async (req, res) => {
    const { content, category_id, anonymous } = req.body;
    const question_id = req.params.id;

    const questionHelper = new QuestionHelper();
    const oldQuestion = await questionHelper.getItemById(question_id)
    if(!oldQuestion.question) return res.status(404).json(new ApiError('q-331'));
    if (oldQuestion.created_by !== req.user.id && !req.user.isadministrator) return res.status(403).json(new ApiError('e-100'));
    const question = new Question(content, oldQuestion.created_by).setAnonymous(anonymous).setCategoryId(category_id).setId(question_id);
    await questionHelper.updateItem(question)

    res.status(200).json({ message: "Question updated successfully", user_id: req.user.id, is_admin: req.user.isadministrator, token: req.token });
});

router.delete('/:id', (req, res) => {
    // Delete a Question from db
    console.log("Delete a Question");
    console.log(req.body);
});

router.get('/:id', identifyCurrentUser, async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({message: "Question id is missing"});

    const questionHelper = new QuestionHelper();
    const response = await questionHelper.getItemById(id);
    response.userId = req.userId;
    response.isAdmin = req.isAdmin;
    if (!response.question) return res.status(404).json(new ApiError('q-331').setData({id, response}));

    res.status(200).json(response);
});

export default router;