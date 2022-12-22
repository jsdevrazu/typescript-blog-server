"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const express_joi_validation_1 = require("express-joi-validation");
const auth_1 = require("../../middleware/auth/auth");
const userCtrl_1 = require("../../controllers/userCtrl/userCtrl");
const router = (0, express_1.Router)();
const validator = (0, express_joi_validation_1.createValidator)({});
const updateSchema = joi_1.default.object({
    fullname: joi_1.default.string().min(5).max(15).required(),
    email: joi_1.default.string().email().required(),
    avatar: joi_1.default.string().required()
});
const updatePasswordSchema = joi_1.default.object({
    newPassword: joi_1.default.string().min(8).max(32).required(),
    oldPassword: joi_1.default.string().min(8).max(32).required(),
});
router.put(`/update/me`, validator.body(updateSchema), auth_1.isAuthenticated, userCtrl_1.updateProfile);
router.put(`/password`, validator.body(updatePasswordSchema), auth_1.isAuthenticated, userCtrl_1.updatePassword);
router.get(`/profile/:id`, userCtrl_1.singleUser);
exports.default = router;
