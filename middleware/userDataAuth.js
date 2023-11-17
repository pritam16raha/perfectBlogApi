import { CustomError } from "../customError";
import JwtService from "../services/JswtService";

const auth = async (req, res, next) => {    
    let authHead = req.headers.authorization;

    console.log(authHead);

    if(!authHead){
        return next(CustomError.unAuthorizedUser());
    }
    
    

    const token = authHead.split(' ')[1];
    try{
        const {_id, role} = await JwtService.validation(token);
        req.user = {}; //user is property but empty, and req is javascript object
        req.user._id = _id;
        req.user.role = role;
        next();

        

    } catch(err){
        return next(CustomError.unAuthorizedToken());
    }


}

export default auth;