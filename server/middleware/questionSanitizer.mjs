import sanitizeHtml from 'sanitize-html';

function questionSanitizer(req, res, next) {
    const { questionText } = req.body;

    const allowedTags = [ 'b', 'i', 'em', 'strong', 'a', 'img' ];
    const allowedAttributes = {
        a: [ 'href', 'title' ],
        img: [ 'src', 'alt', 'title' ]
    };

    req.body.questionText = sanitizeHtml(questionText , { allowedTags, allowedAttributes });

    next();
}

export default questionSanitizer;
