import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js";
import {login}  from "../controllers/user.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js";
import { logOut } from "../controllers/user.controller.js";

const router=Router()

router.route('/signup').post(registerUser)
router.route('/login').post(login)
router.route('/logout').post(verifyJwt,logOut)

export default router