class TransportObject {
    success;
    message;
    payload;
    constructor(){
        this.success = true;
    }
    setMessage(message){
        this.message = message;
        return this;
    }
    setSuccess(successState){
        this.success = successState;
        return this;
    }
    setPayload(payload){
        this.payload = payload;
        return this;
    }
}

export default TransportObject;