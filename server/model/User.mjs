import bcrypt from "bcrypt";

class User {
    id;
    username;
    email;
    password;
    firstname;
    status;
    lastname;
    userGroup;

    constructor(firstname, lastname, username, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
    }

    setPassword(password, isHashed = false) {
        if (isHashed) {
            this.password = password;
        } else {
            this.password = this.hashPassword(password);
        }
    }

    hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
}

export default User;