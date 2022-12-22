"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const catchAsyncError_1 = __importDefault(require("../catchAsyncError"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../models/user/userModel"));
exports.isAuthenticated = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("Bearer ")[1]) || req.cookies.token;
    if (!token)
        return next(new errorHandler_1.default("Invalid authorization token. please try again", 400));
    const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
    const user = yield userModel_1.default.findById(decoded.id);
    if (!user)
        return next(new errorHandler_1.default("Invalid authorization token. please try again", 400));
    req.user = user;
    next();
}));
