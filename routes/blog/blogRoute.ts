import { Router } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import { isAuthenticated } from "../../middleware/auth/auth";
import {
  createBlog,
  getBlogsByCategory,
  getBlogsByUser,
  getHomeBlog,
  getSingleBlog,
} from "../../controllers/blogCtrl/blogCtrl";

const router = Router();
const validator = createValidator({});

const createBlogSchema = Joi.object({
  title: Joi.string().min(10).max(50).required(),
  content: Joi.string().min(2000).required(),
  description: Joi.string().min(5).max(200).required(),
  thumbnail: Joi.string().required(),
  category: Joi.any(),
  user: Joi.any(),
});

router.post(
  "/create-blog",
  validator.body(createBlogSchema),
  isAuthenticated,
  createBlog
);
router.get("/home/blogs", getHomeBlog);
router.get("/home/blogs/:category_id", getBlogsByCategory);
router.get("/blogs/user/:id", getBlogsByUser);
router.get("/blog/:id", getSingleBlog);

export default router;
