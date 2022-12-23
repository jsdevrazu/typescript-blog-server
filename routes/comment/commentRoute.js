import { Router } from 'express'
import { createValidator } from 'express-joi-validation'
import { isAuthenticated } from '../../middleware/auth/auth.js';
import { createComment, getComment } from '../../controllers/commentCtrl/commentCtrl.js';

const router = Router();


router.post("/comment", isAuthenticated, createComment);
router.get("/comments/blog/:id", getComment);

export default router;