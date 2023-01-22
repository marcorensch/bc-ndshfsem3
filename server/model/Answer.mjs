
class Answer {
    content;
    user_id;
    question_id;
    constructor(content, user_id) {
        this.content = content;
        this.user_id = user_id;
    }
    setQuestionId(question_id) {
        this.question_id = question_id;
        return this;
    }
}

export default Answer;