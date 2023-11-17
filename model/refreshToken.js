//refresh token must be saved in database, for me it will be saved in mongoDB

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    token: { type: String, unique: true }
}, { timestamps: true });

export default mongoose.model('RefreshToken', refreshTokenSchema, 'Tokens');