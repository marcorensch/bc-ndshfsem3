import bcrypt from "bcrypt";

class User {
    id;
    username;
    email;
    password;
    firstname;
    status;
    lastname;
    usergroup;
    isadministrator;

    constructor(firstname, lastname, username, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
    }
    setPassword(password, isHashed = false) {
        this.password = isHashed ? password : this.hashPassword(password);
        return this;
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
    checkPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

export default User;