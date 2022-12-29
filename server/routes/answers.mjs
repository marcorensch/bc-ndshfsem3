import express from "express";

const router = express.Router();
import {authenticateToken} from "../middleware/authenticate.mjs";
import ApiError from "../model/ApiError.mjs";
import identifyCurrentUser from "../middleware/identifyCurrentUser.mjs";
import Answer from "../model/Answer.mjs";
import AnswerHelper from "../helper/AnswerHelper.mjs";

router.post('/create', identifyCurrentUser, authenticateToken, async (req, res) => {
    const {question_id, content} = req.body;
    const user = req.user;
    const answerHelper = new AnswerHelper();
    const answer = new Answer(content, user.id).setQuestionId(question_id);
    const result = await answerHelper.storeItem(answer);

    if (!result.success) {
        console.log(result);
        return res.status(500).json(new ApiError('e-999'));
    }
    res.status(201).json({message: "Answer created successfully", user_id: user.id, is_admin: user.isadministrator, token: req.token});
});
export default router;