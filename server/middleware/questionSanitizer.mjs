import sanitizeHtml from 'sanitize-html';

function questionSanitizer(req, res, next) {
    const { questionText } = req.body;

    const allowedTags = [ 'b', 'i', 'em', 'strong', 'a' ];
    const allowedAttributes = {
        a: [ 'href' ]
    };

    req.body.questionText = sanitizeHtml(questionText , { allowedTags, allowedAttributes });

    next();
}

export default questionSanitizer;
