"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const express_joi_validation_1 = require("express-joi-validation");
const auth_1 = require("../../middleware/auth/auth");
const categoryCtrl_1 = require("../../controllers/categoryCtrl/categoryCtrl");
const router = (0, express_1.Router)();
const validator = (0, express_joi_validation_1.createValidator)({});
const categorySchema = joi_1.default.object({
    name: joi_1.default.string().max(50).required()
});
router.post("/category", validator.body(categorySchema), auth_1.isAuthenticated, categoryCtrl_1.createCategory);
router.put("/category/:id", validator.body(categorySchema), auth_1.isAuthenticated, categoryCtrl_1.updateCategory);
router.delete("/category/:id", auth_1.isAuthenticated, categoryCtrl_1.deleteCategory);
router.get("/categories", categoryCtrl_1.getCategories);
exports.default = router;
