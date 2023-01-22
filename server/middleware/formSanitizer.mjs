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

function loginSanitizer(req, res, next) {
    const allowedTags = [];
    const allowedAttributes = {};
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const credentials = atob(authHeader.split(' ')[1]).split(':');

    req.body.username = sanitizeHtml(credentials[0], { allowedTags, allowedAttributes });
    req.body.password = sanitizeHtml(credentials[1], { allowedTags, allowedAttributes });

    next();
}

export { formSanitizer, loginSanitizer };
