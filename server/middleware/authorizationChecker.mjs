import UserHelper from "../helper/UserHelper.mjs";
import UsergroupsHelper from "../helper/UsergroupsHelper.mjs";
import CategoryHelper from "../helper/CategoryHelper.mjs";
import QuestionHelper from "../helper/QuestionHelper.mjs";

function isAdmin(usergroup, usergroups) {
    return usergroup === usergroups.filter((usergroup) => usergroup.alias === "administrator")[0].id;
}

function isOwner(userId, item, target) {
    if(item.created_by && item.created_by === userId) return true;
    return target === "user" && item.id && item.id === userId;

}

function getHelper(target) {
    switch(target) {
        case "user": return UserHelper;
        case "category": return CategoryHelper;
        case "question": return QuestionHelper;
        default: return false;
    }
}

const isAuthorized = (target) => {
    const controller = getHelper(target);
    return async (req, res, next) => {
        console.log("authorizationChecker called");
        req.isAuthorized = false;
        const user = req.user;
        const ctrl = new controller();
        const item = await ctrl.getItemById(req.params.id);
        console.log("User: ", user);
        if (user.id) {
            const userHelper = new UserHelper();
            const usergroupsHelper = new UsergroupsHelper();
            const userData = await userHelper.getUserById(user.id);
            const usergroups = await usergroupsHelper.getAllUsergroups();
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