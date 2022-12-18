import bcrypt from "bcrypt";

class User {
    id;
    username;
    email;
    password;
    firstName;
    lastName;
    userGroup;

    constructor(id, username, email, firstName, lastName, userGroup) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userGroup = userGroup;
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