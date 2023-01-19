import express from "express";

const router = express.Router();
import {authenticateToken} from "../middleware/authenticate.mjs";
import Question from "../model/Question.mjs";
import {questionSanitizer} from "../middleware/sanitizers.mjs";
import QuestionHelper from "../helper/QuestionHelper.mjs";
import ApiError from "../model/ApiError.mjs";
import questionChecker from "../middleware/questionChecker.mjs";
import identifyCurrentUser from "../middleware/identifyCurrentUser.mjs";
import TransportObject from "../model/TransportObject.mjs";
import isAuthorized from "../middleware/authorizationChecker.mjs";

router.get('/', identifyCurrentUser, async (req, res) => {
    const {count, page, user_id, category_id, direction} = req.query;
    const queryParams = {
        count: count || 25,
        page: page || 1,
        user_id: user_id || false,
        category_id: category_id || false,
        direction: direction || "DESC"
    }
    const questionHelper = new QuestionHelper();
    const set = await questionHelper.getItems(queryParams);
    const total = await questionHelper.getTotalCount();
    if (set.success) {
        const transportObject = new TransportObject().setSuccess(true).setPayload({
            questions: set.data,
            userId: req.id,
            isAdmin: req.isAdmin,
            total: Number(total),
            queryParams
        }).setMessage("Questions fetched successfully");
        res.status(200).json(transportObject);
    } else {
        res.status(500).json(set);
    }
});

router.post('/create', authenticateToken, questionSanitizer, questionChecker, async (req, res) => {
    let {content, category_id, anonymous, tags} = req.body;


    // Add a new Question to db
    const question = new Question(content, req.user.id).setAnonymous(anonymous).setCategoryId(category_id);
    let transportObject = new TransportObject();
    try {
        const questionHelper = new QuestionHelper();
        const createdQuestionId = await questionHelper.storeItem(question);
        if(!createdQuestionId) return res.status(500).json(new ApiError("e-999"));
        if(tags.length) await questionHelper.storeTags(createdQuestionId, tags);
        transportObject.setPayload({
            question_id: Number(createdQuestionId),
            user_id: req.user.id,
            is_admin: req.user.isadministrator,
            token: req.token
        })
    } catch (error) {
        console.error(error);
        if (error.errno === 1452) res.status(422).json(new ApiError('c-331'));
        res.status(500).json(error);
    }
    transportObject.setSuccess(true).setMessage("Question created successfully");
    res.status(201).json(transportObject);
});

router.put("/:id", authenticateToken, isAuthorized("question"), questionSanitizer, questionChecker, async (req, res) => {
    const questionHelper = new QuestionHelper();
    const updatedQuestion = new Question(req.body.content, req.user.id).setId(req.params.id).setAnonymous(req.body.anonymous).setCategoryId(req.body.category_id).setTags(req.body.tags).setAcceptedId(req.body.accepted_id);
    const updated = await questionHelper.updateItem(updatedQuestion);
    if(!updated) return res.status(500).json(new ApiError("e-999"));
    return res.status(200).json(new TransportObject().setSuccess(true).setMessage("Question updated successfully"));
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const questionHelper = new QuestionHelper();
    const createdById = await questionHelper.getKeyValue(req.params.id, 'created_by');
    req.user.isQuestionOwner = createdById === req.user.id;
    if(!req.user.isadministrator && !req.user.isQuestionOwner) return res.status(403).json(new ApiError('e-100'));
    const deleted = await questionHelper.deleteItem(req.params.id);

    if(!deleted) return res.status(500).json(new ApiError('e-999'));
    return res.status(200).json(new TransportObject().setSuccess(true).setMessage("Question deleted successfully"));
});

router.get('/:id', identifyCurrentUser, async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({message: "Question id is missing"});

    const questionHelper = new QuestionHelper();
    const response = await questionHelper.getItemById(id);
    response.userId = req.userId;
    response.isAdmin = req.isAdmin;
    if (!response) return res.status(404).json(new ApiError('q-331').setData({id, response}));

    res.status(200).json(response);
});

router.post('/:id/vote', authenticateToken, async (req, res) => {
    const questionHelper = new QuestionHelper();
    const response = await questionHelper.vote(req.params.id, req.user.id, req.body.vote);
    if(!response.success) {
        return res.status(500).json(new ApiError('e-999'));
    }
    const transportObject = new TransportObject()
        .setSuccess(true)
        .setMessage("Voting done")
        .setPayload({
            answer_id: Number(req.params.id), user_id: req.user.id, is_admin: req.user.isadministrator, token: req.token
        })
    return res.status(200).json(transportObject);
});

export default router;