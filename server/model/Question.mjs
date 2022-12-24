class Question {
    _id;
    content;
    category_id;
    created_by;
    anonymous;
    accepted_id;
    created_at;
    modified_at;
    constructor(content, created_by) {
        this.content = content;
        this.created_by = created_by;
    }


    set id(value) {
        this._id = value;
    }

    set setCategoryId(value) {
        this.category_id = value;
    }

    set anonymous(value) {
        this._anonymous = value;
    }

    set accepted_id(value) {
        this._accepted_id = value;
    }

    set created_at(value) {
        this._created_at = value;
    }

    set modified_at(value) {
        this._modified_at = value;
    }
}

export default Question;