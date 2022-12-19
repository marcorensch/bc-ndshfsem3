
class ApiError {
    constructor(status, message) {
        this.status = status;
        this.message = message;

        return this;
    }
}

export default ApiError;