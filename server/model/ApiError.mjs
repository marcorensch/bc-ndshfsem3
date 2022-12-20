
class ApiError {
    constructor(status, message, column=null) {
        this.status = status;
        this.relatedColumn = column;
        this.message = message;
        this.data = null;
        return this;
    }

    setData(data){
        this.data = data;
        return this;
    }
}

export default ApiError;