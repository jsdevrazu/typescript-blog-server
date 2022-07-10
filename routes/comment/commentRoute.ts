import { Router } from 'express'
import Joi from 'joi';
import { createValidator } from 'express-joi-validation'
import { isAuthenticated } from '../../middleware/auth/auth';
import { createComment, getComment } from '../../controllers/commentCtrl/commentCtrl';

const router = Router();
const validator = createValidator({});


router.post("/comment", isAuthenticated, createComment);
router.get("/comments/blog/:id", getComment);

export default router;