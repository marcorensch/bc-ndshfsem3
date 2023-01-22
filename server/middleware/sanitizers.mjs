import sanitizeHtml from 'sanitize-html';

function sanitizeContent(content){
    const allowedTags = [ 'p','span','br','b', 'i', 'em', 'strong', 'a', 'img', 'pre', 'code' ];
    const allowedAttributes = {
        a: [ 'href', 'title' ],
        img: [ 'src', 'alt', 'title', 'width', 'height']
    };

    return sanitizeHtml(content, { allowedTags, allowedAttributes });
}
export function questionSanitizer(req, res, next) {
    const { content, tags } = req.body;
    req.body.content = sanitizeContent(content);
    req.body.tags = tags.map(tag => sanitizeHtml(tag, { allowedTags: [], allowedAttributes: {} }));

    next();
}

export function answerSanitizer(req, res, next){
    const { content } = req.body;
    req.body.content = sanitizeContent(content);

    next();
}
