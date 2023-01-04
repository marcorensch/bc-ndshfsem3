import sanitizeHtml from 'sanitize-html';
import FieldChecker from "../utils/FieldChecker.mjs";

function questionSanitizer(req, res, next) {
    const fieldChecker = new FieldChecker();

    const { content, tags } = req.body;

    const allowedTags = [ 'p','span','br','b', 'i', 'em', 'strong', 'a', 'img' ];
    const allowedAttributes = {
        a: [ 'href', 'title' ],
        img: [ 'src', 'alt', 'title', 'width', 'height']
    };

    req.body.content = sanitizeHtml(content , { allowedTags, allowedAttributes });
    req.body.tags = tags.map(tag => sanitizeHtml(tag, { allowedTags: [], allowedAttributes: {} }));

    next();
}

export default questionSanitizer;
