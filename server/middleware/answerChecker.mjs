import ApiError from "../model/ApiError.mjs";
import FieldChecker from "../utils/FieldChecker.mjs";

function answerChecker(req, res, next) {
    const { content } = req.body;
    const fieldChecker = new FieldChecker();

    console.log(req.body.content);


    if (!content) {
        return res.status(422).json(new ApiError('a-317'));
    }

    const result = fieldChecker.hasValidLength(content, fieldChecker.answer.min, fieldChecker.answer.max);
    console.log(result);
    if (!result) return res.status(422).json(new ApiError('a-318'));

    req.body.content = content;


    next();
}

export default answerChecker;