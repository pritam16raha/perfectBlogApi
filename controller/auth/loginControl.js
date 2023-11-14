import Joi from "joi";

import bcrypt from 'bcrypt';

import JwtService from "../../services/JswtService";

import { User } from "../../model";

//import CustomErrorHandler from "../../customError/customError2/CustomErrorHandler";
import { CustomError } from "../../customError";

const login = {
    async logIn(req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });

        const{error} = loginSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try{
            //userid(email) check
            const user = await User.findOne({ email: req.body.email });
            if(!user){
                 return next(CustomError.notFound());
            }

            //password check

            const passKey = await bcrypt.compare(req.body.password, user.password);
            if(!passKey){
                return next(CustomError.notFound("only the password is wrong"));
            }
            //login successfull
            const accessToken = JwtService.sign({ _id: user._id, role: user.role })
            res.json({ accessToken });
        } catch(err){
            return next(err);
        }
    } 
}

export default login;