const errorCodes = {
    "e-999": "Unknown Error",
    "e-100": "Not allowed",
    "u-317": "Field is required",
    "u-318": "Invalid email address",
    "u-319": "Invalid field length",
    "u-320": "Invalid / Forbidden characters",
    "u-321": "Forbidden value",
    "u-322": "Already exists",
    "u-331": "User not found",
    "u-332": "Wrong Password",
    "u-341": "Refresh token is missing",
    "u-342": "Refresh token is invalid",
    "c-331": "Category not found",
    "c-322": "Category already exists",
    "q-317": "Question text empty or too short",
    "q-318": "Category id is required",
    "q-331": "Question not found",
}
class ApiError {
    errorCode;
    message;
    relatedColumn
    data;
    constructor(errorCode, column=null) {
        this.success = false;
        this.errorCode = errorCode;
        this.message = errorCodes[errorCode] || "unkonwn error";
        this.relatedColumn = column;
        return this;
    }

    setData(data){
        this.data = data;
        return this;
    }
}

export default ApiError;