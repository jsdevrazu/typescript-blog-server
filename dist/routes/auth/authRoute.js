"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const authCtrl_1 = require("../../controllers/authCtrl/authCtrl");
const express_joi_validation_1 = require("express-joi-validation");
const auth_1 = require("../../middleware/auth/auth");
const router = (0, express_1.Router)();
const validator = (0, express_joi_validation_1.createValidator)({});
const registerSchema = joi_1.default.object({
    fullname: joi_1.default.string().min(5).max(15).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(32).required(),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(32).required(),
});
router.post("/register", validator.body(registerSchema), authCtrl_1.register);
router.post("/active-account", authCtrl_1.verifyAccount);
router.post("/login", validator.body(loginSchema), authCtrl_1.login);
router.get("/logout", auth_1.isAuthenticated, authCtrl_1.logout);
exports.default = router;
