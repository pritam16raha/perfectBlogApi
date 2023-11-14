import express from "express";

const router = express.Router();

import auth from "../middleware/userDataAuth";

import { registerController, loginController, getUserData } from "../controller";


router.post('/register', registerController.register);

router.post('/login', loginController.logIn);

router.get('/getUserData', auth, getUserData.getUser);



export default router;