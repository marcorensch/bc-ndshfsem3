import express from "express";

const router = express.Router();
import {authenticateToken} from "../middleware/authenticate.mjs";
import ApiError from "../model/ApiError.mjs";
import Answer from "../model/Answer.mjs";
import AnswerHelper from "../helper/AnswerHelper.mjs";
import TransportObject from "../model/TransportObject.mjs";
import isAuthorized from "../middleware/authorizationChecker.mjs";
import {answerSanitizer} from "../middleware/sanitizers.mjs";
import answerChecker from "../middleware/answerChecker.mjs";

router.post('/create', authenticateToken, answerChecker, answerSanitizer, async (req, res) => {
    const answerHelper = new AnswerHelper();
    const {question_id, content} = req.body;
    const user = req.user;
    const answer = new Answer(content, user.id).setQuestionId(question_id);
    const result = await answerHelper.storeItem(answer);

    if (!result.success) return res.status(500).json(new ApiError('e-999'));

    const transportObject = new TransportObject()
        .setSuccess(true)
        .setMessage("Answer created successfully")
        .setPayload({
            user_id: user.id, is_admin: user.isadministrator, token: req.token
        })
    return res.status(201).json(transportObject);
});

router.delete('/:id', authenticateToken, isAuthorized("answer"), async (req, res) => {
    const answerHelper = new AnswerHelper();
    const answerId = req.params.id;
    const user = req.user;
    const result = await answerHelper.deleteItem(answerId);

    if (!result) return res.status(500).json(new ApiError('e-999'));

    const transportObject = new TransportObject()
        .setSuccess(true)
        .setMessage("Answer deleted successfully")
        .setPayload({
            user_id: user.id, is_admin: user.isadministrator, token: req.token
        })
    return res.status(200).json(transportObject);
});

router.post('/:id/vote', authenticateToken, async (req, res) => {
    const answerHelper = new AnswerHelper();
    const response = await answerHelper.vote(req.params.id, req.user.id, req.body.vote);

    if(!response.success) return res.status(500).json(new ApiError('e-999'));

    const transportObject = new TransportObject()
        .setSuccess(true)
        .setMessage("Voting done for Answer")
        .setPayload({
            answer_id: Number(req.params.id), user_id: req.user.id, is_admin: req.user.isadministrator, token: req.token
        })
    return res.status(200).json(transportObject);
});

router.put('/:id', authenticateToken, isAuthorized("answer"), answerChecker, answerSanitizer,  async (req, res) => {
    const answerHelper = new AnswerHelper();
    const response = await answerHelper.updateItem(req.params.id, req.body.content);

    if(!response.success) return res.status(500).json(new ApiError('e-999'));

    const transportObject = new TransportObject()
        .setSuccess(true)
        .setMessage("Answer updated")
        .setPayload({
            answer_id: Number(req.params.id), user_id: req.user.id, is_admin: req.user.isadministrator, token: req.token
        })
    return res.status(200).json(transportObject);
});
export default router;