import { Router } from 'express'
import Joi from 'joi';
import { createValidator } from 'express-joi-validation'
import { isAuthenticated } from '../../middleware/auth/auth';
import { singleUser, updatePassword, updateProfile } from '../../controllers/userCtrl/userCtrl';


const router = Router();
const validator = createValidator({});


const updateSchema = Joi.object({
    fullname:Joi.string().min(5).max(15).required(),
    email:Joi.string().email().required(),
    avatar:Joi.string().required()
})

const updatePasswordSchema = Joi.object({
    newPassword:Joi.string().min(8).max(32).required(),
    oldPassword:Joi.string().min(8).max(32).required(),
})

router.put(`/update/me`, validator.body(updateSchema), isAuthenticated, updateProfile)
router.put(`/password`, validator.body(updatePasswordSchema), isAuthenticated, updatePassword)
router.get(`/profile/:id`, singleUser)

export default router;