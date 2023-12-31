import Joi from 'joi';

import { CustomError } from '../../customError';

import { RefreshToken, User } from '../../model';

import bcrypt from 'bcrypt';

import JwtService from '../../services/JswtService';

import { REFRESH_SECRET } from '../../config';

const regController = {
    async register(req, res, next){
        
        const registerSchema = Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeatPassword: Joi.ref('password')
        });

        const { error } = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try{
            const exist = await User.exists({ email : req.body.email });
            if(exist){
                return next(CustomError.alreadyExist('Email is Already Present in Database'));
            }
        } catch(error){
            return next(error);
        }

        const { name, email, password } = req.body;
    
        const hashPassword = await bcrypt.hash(password, 10);
    

    
        const user = new User({
            name,
            email,
            password: hashPassword
        });

        let accessToken;

        let refreshToken;

        try{
            const result = await user.save();

            accessToken = JwtService.sign({ _id: result._id, role: result.role })

            refreshToken = JwtService.sign({ _id: result._id, role: result.role }, '1d', REFRESH_SECRET );

            await RefreshToken.create({ token: refreshToken });
            
        } catch(error){
            return next(error);
        }
    
        res.json({ accessToken: accessToken, refreshToken: refreshToken });

    }
}

export default regController;