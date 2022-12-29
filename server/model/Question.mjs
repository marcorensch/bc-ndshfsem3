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

    setCategoryId(category_id){
        this.category_id = parseInt(category_id);
        return this;
    }

    setAnonymous(anonymous){
        this.anonymous = anonymous ? 1 : 0;
        return this;
    }

    setId(id){
        this.id = id;
        return this;
    }
}

export default Question;