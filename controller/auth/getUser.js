import { CustomError } from "../../customError";
import { User } from "../../model";

const getUserData = {
    async getUser(req, res, next) {
        try{
            const user = await User.findOne({ _id: req.user._id });

            if(!user){
                return next(CustomError.userDataNotFound());
            }
            res.json(user);

        } catch(err){
            return next(err);
        }
    }
}

export default getUserData;