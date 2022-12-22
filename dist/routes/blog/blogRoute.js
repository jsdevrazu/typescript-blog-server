"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const express_joi_validation_1 = require("express-joi-validation");
const auth_1 = require("../../middleware/auth/auth");
const blogCtrl_1 = require("../../controllers/blogCtrl/blogCtrl");
const router = (0, express_1.Router)();
const validator = (0, express_joi_validation_1.createValidator)({});
const createBlogSchema = joi_1.default.object({
    title: joi_1.default.string().min(10).max(50).required(),
    content: joi_1.default.string().min(2000).required(),
    description: joi_1.default.string().min(5).max(200).required(),
    thumbnail: joi_1.default.string().required(),
    category: joi_1.default.any(),
    user: joi_1.default.any(),
});
router.post("/create-blog", validator.body(createBlogSchema), auth_1.isAuthenticated, blogCtrl_1.createBlog);
router.get("/home/blogs", blogCtrl_1.getHomeBlog);
router.get("/home/blogs/:category_id", blogCtrl_1.getBlogsByCategory);
router.get("/blogs/user/:id", blogCtrl_1.getBlogsByUser);
router.get("/blog/:id", blogCtrl_1.getSingleBlog);
exports.default = router;
