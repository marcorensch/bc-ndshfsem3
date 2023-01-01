import TokenHelper from "../helper/TokenHelper.mjs";

async function identifyCurrentUser (req, res, next) {
    req.userId = null;
    req.isAdmin = null;

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const tokenString = authHeader && authHeader.split(' ')[1];

    if (tokenString){
        const tokenHelper = new TokenHelper();
        try {
            const tokenContent = await tokenHelper.checkToken(tokenString);
            console.log(tokenContent);
            req.userId = tokenContent.id;
            req.isAdmin = tokenContent.isAdmin;
        }catch(err) {

        }
    }
    next();
}

export default identifyCurrentUser;