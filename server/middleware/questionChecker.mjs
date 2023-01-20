import ApiError from "../model/ApiError.mjs";
import FieldChecker from "../utils/FieldChecker.mjs";

function questionChecker(req, res, next) {
    const { content, category_id, anonymous, tags } = req.body;
    const fieldChecker = new FieldChecker();

    if (!content) {
        return res.status(422).json(new ApiError('q-317'));
    }
    if (!category_id) return res.status(422).json(new ApiError('q-318'));

    const result = fieldChecker.hasValidLength(content, fieldChecker.question.min, fieldChecker.question.max);
    if (!result) return res.status(422).json(new ApiError('q-316'));

    req.body.content = content;
    req.body.category_id = category_id;
    req.body.anonymous = fieldChecker.setBoolean(anonymous);
    req.body.tags = fieldChecker.checkTags(tags);

    next();
}

export default questionChecker;