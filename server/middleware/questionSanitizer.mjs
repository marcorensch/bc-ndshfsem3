import sanitizeHtml from 'sanitize-html';

function questionSanitizer(req, res, next) {
    const { content } = req.body;

    const allowedTags = [ 'p','span','br','b', 'i', 'em', 'strong', 'a', 'img' ];
    const allowedAttributes = {
        a: [ 'href', 'title' ],
        img: [ 'src', 'alt', 'title' ]
    };

    req.body.content = sanitizeHtml(content , { allowedTags, allowedAttributes });

    next();
}

export default questionSanitizer;
