import UserController from "../controller/UserController.mjs";
import UsergroupsController from "../controller/UsergroupsController.mjs";
import CategoryController from "../controller/CategoryController.mjs";
import QuestionController from "../controller/QuestionController.mjs";

function isAdmin(usergroup, usergroups) {
    return usergroup === usergroups.filter((usergroup) => usergroup.alias === "administrator")[0].id;
}

function isOwner(userId, item, target) {
    if(item.created_by && item.created_by === userId) return true;
    if(target === "user" && item.id && item.id === userId) return true;
    return false;
}

function getController(target) {
    switch(target) {
        case "user": return UserController;
        case "category": return CategoryController;
        case "question": return QuestionController;
        default: return false;
    }
}

const isAuthorized = (target) => {
    const controller = getController(target);
    return async (req, res, next) => {
        req.isAuthorized = false;
        const user = req.user;
        const ctrl = new controller();
        const item = await ctrl.getItemById(req.params.id);
        console.log("User: ", user);
        if (user.id) {
            const userController = new UserController();
            const usergroupsController = new UsergroupsController();
            const userData = await userController.getUserById(user.id);
            const usergroups = await usergroupsController.getAllUsergroups();
            const isAdminUser = isAdmin(userData.usergroup, usergroups);
            const isOwnerOf = isOwner(user.id, item, target);
            if ( isAdminUser || isOwnerOf) {
                req.isAuthorized = true;
                req.isAdmin = isAdminUser;
                req.isOwner = isOwnerOf;
                next();
            } else {
                console.log("User is not Authorized to do this task");
                res.status(401).send("Unauthorized");
            }
        }
    }
};

export default isAuthorized;