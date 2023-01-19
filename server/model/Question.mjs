class Question {
    id;
    content;
    category_id;
    created_by;
    anonymous;
    accepted_id;
    created_at;
    modified_at;
    tags = [];

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

    setTags(tags){
        this.tags = tags;
        return this;
    }

    setId(id){
        this.id = parseInt(id);
        return this;
    }
    setAcceptedId(accepted_id){
        this.accepted_id = accepted_id ? parseInt(accepted_id) : null;
        return this;
    }
}

export default Question;