import { Router } from 'express'
import Joi from 'joi';
import { createValidator } from 'express-joi-validation'
import { isAuthenticated } from '../../middleware/auth/auth';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../controllers/categoryCtrl/categoryCtrl';

const router = Router();
const validator = createValidator({});


const categorySchema = Joi.object({
    name:Joi.string().max(50).required()
})

router.post("/category", validator.body(categorySchema), isAuthenticated, createCategory);
router.put("/category/:id", validator.body(categorySchema), isAuthenticated, updateCategory);
router.delete("/category/:id", isAuthenticated, deleteCategory);
router.get("/categories", getCategories);


export default router;