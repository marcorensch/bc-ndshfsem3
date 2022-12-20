import sanitizeHtml from 'sanitize-html';

function formSanitizer(req, res, next) {
    const { firstname, lastname, username, password, email } = req.body;

    const allowedTags = [];
    const allowedAttributes = {};

    req.body.firstname = sanitizeHtml(firstname , { allowedTags, allowedAttributes });
    req.body.lastname = sanitizeHtml(lastname, { allowedTags, allowedAttributes });
    req.body.username = sanitizeHtml(username, { allowedTags, allowedAttributes });
    req.body.password = sanitizeHtml(password, { allowedTags, allowedAttributes });
    req.body.email = sanitizeHtml(email, { allowedTags, allowedAttributes });

    next();
}

export default formSanitizer;
