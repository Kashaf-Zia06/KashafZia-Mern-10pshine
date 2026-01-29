import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js";
import {login}  from "../controllers/user.controller.js";
import {verifyJwt} from "../middlewares/auth.middleware.js";
import { logOut } from "../controllers/user.controller.js";
import { getUserNotes } from "../controllers/notes.controller.js";
import { forgotPassword, resetPassword } from "../controllers/user.controller.js";

const router=Router()

router.route('/signup').post(registerUser)
router.route('/login').post(login)
router.route('/logout').post(logOut)
router.route('/dashboard').get(verifyJwt,getUserNotes)
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

export default router