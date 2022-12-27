import ApiError from "../model/ApiError.mjs";
import FieldChecker from "../utils/FieldChecker.mjs";

function questionChecker(req, res, next) {
    const { content, category_id, anonymous } = req.body;
    const fieldChecker = new FieldChecker();

    if (!content) {
        return res.status(422).json(new ApiError('q-317', "Question content is required"));
    }
    if (!category_id) return res.status(422).json(new ApiError('q-318', "Category id is required"));

    const result = fieldChecker.hasValidLength(content, fieldChecker.question.min, fieldChecker.question.max);
    if (!result) return res.status(422).json(new ApiError('q-318', "Question content has no valid length"));

    req.body.content = content;
    req.body.category_id = category_id;
    req.body.anonymous = fieldChecker.setBoolean(anonymous);

    next();
}

export default questionChecker;