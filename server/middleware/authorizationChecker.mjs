import UserController from "../controller/UserController.mjs";
import UsergroupsController from "../controller/UsergroupsController.mjs";

function isAdmin(usergroup, usergroups) {
    return usergroup === usergroups.filter((usergroup) => usergroup.alias === "administrator")[0].id;
}
async function isAuthorized (req, res, next) {
    req.isAuthorized = false;
    const user = req.user;
    console.log("User: ", user);
    if (user.id) {
        const userController = new UserController();
        const usergroupsController = new UsergroupsController();
        const userData = await userController.getUserById(user.id);
        const usergroups = await usergroupsController.getAllUsergroups();
        if (isAdmin(userData.usergroup, usergroups)) {
            console.log("User is admin");
            next();
        }else{
            console.log("User is not admin");
            res.status(401).send("Unauthorized");
        }
    }
};

export default isAuthorized;