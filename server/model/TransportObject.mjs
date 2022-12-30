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

    setSuccess(success){
        this.success = success;
        return this;
    }
    setPayload(payload){
        this.payload = payload;
        return this;
    }
}

export default TransportObject;