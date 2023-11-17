import Joi from "joi";
import { REFRESH_SECRET } from "../../config";
import { RefreshToken, User } from "../../model";
import { CustomError } from "../../customError";
import JwtService from "../../services/JswtService";

const refreshToken = {
    async generateToken(req, res, next){
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);

        if(error){
            return next(error);
        }

        // now checking token with database token
        
        let RefToken;

        try{
            RefToken = await RefreshToken.findOne({ token: req.body.refresh_token });

            if(!RefToken){
                return next(CustomError.invalidToken());
            }

            //if token present, verifing then
            let userId;
            
            //console.log(RefToken);
            //console.log(REFRESH_SECRET);


            try{
                const { _id } = await JwtService.verify(RefToken.token, REFRESH_SECRET);
                userId = _id;

            } catch(err){
                return next(CustomError.notValid(err.message));
            }

            //not found, but now checking the user is present in database or not
            const user = await User.findOne({ _id: userId })
            if(!user){
                return next(CustomError.notValid("user id not found in database"));
            }

            //all validation is done, now generate access token and refresh token for another auto login
            const accessToken = JwtService.sign({ _id: user._id, role: user.role });
            const refreshToken = JwtService.sign({ _id: user._id, role: user.role }, '1d', REFRESH_SECRET );
            await RefreshToken.create({ token: refreshToken });
            res.json({ accessToken, refreshToken });



        } catch(err){
            return next(new Error(err.message+" token doesn't match with database token"));
        }




    }
}

export default refreshToken;