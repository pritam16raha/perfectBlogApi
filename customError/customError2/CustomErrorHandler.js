class CustomErrorHandler extends Error{
    constructor(status, msg){
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message){
        return new CustomErrorHandler(409, message);
    }

    static notFound(message = "username ta vul diyecho dekho"){
        return new CustomErrorHandler(401, message);
    }

    static userDataNotFound(message= 'user data fetch kora jaini'){
        return new CustomErrorHandler(405, message);
    }

    static unAuthorizedUser(message= 'access token vul ache'){
        return new CustomErrorHandler(406, message);
    }

    static unAuthorizedToken(message= 'token has been compromised!'){
        return new CustomErrorHandler(407, message);
    }
}

export default CustomErrorHandler;