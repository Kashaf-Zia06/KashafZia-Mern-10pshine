import {Router} from "express"

import { verifyJwt } from "../middlewares/auth.middleware.js"
import { addNotes } from "../controllers/notes.controller.js"
import { editNotes } from "../controllers/notes.controller.js"
import { deleteNotes } from "../controllers/notes.controller.js"
import { getUserNotes } from "../controllers/notes.controller.js"

const router=Router()

router.route('/add').post(verifyJwt,addNotes)
router.route('/edit/:id').put(verifyJwt,editNotes)

router.route('/delete/:noteId').delete(verifyJwt,deleteNotes)
router.route('/dashboard').get(verifyJwt, getUserNotes);  // GET /notes




export default router