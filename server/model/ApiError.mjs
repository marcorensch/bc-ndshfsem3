
class ApiError {
    errorCode;
    message;
    relatedColumn
    data;
    constructor(errorCode, message, column=null) {
        this.errorCode = errorCode;
        this.message = message;
        this.relatedColumn = column;
        return this;
    }

    setData(data){
        this.data = data;
        return this;
    }
}

export default ApiError;