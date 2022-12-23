import { Router } from 'express'
import Joi from 'joi';
import { login, logout, register, verifyAccount } from '../../controllers/authCtrl/authCtrl.js';
import { createValidator } from 'express-joi-validation'
import { isAuthenticated } from '../../middleware/auth/auth.js';

const router = Router();
const validator = createValidator({});


const registerSchema = Joi.object({
    fullname:Joi.string().min(5).max(15).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(8).max(32).required(),
});

const loginSchema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().min(8).max(32).required(),
})

router.post("/register", validator.body(registerSchema), register);
router.post("/active-account", verifyAccount);
router.post("/login", validator.body(loginSchema), login);
router.get("/logout", isAuthenticated, logout);

export default router;