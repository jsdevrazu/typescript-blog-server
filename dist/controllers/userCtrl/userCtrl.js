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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.updatePassword = exports.singleUser = exports.updateProfile = void 0;
const catchAsyncError_1 = __importDefault(require("../../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const userModel_1 = __importDefault(require("../../models/user/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//When any user try to update her profile fire this function
exports.updateProfile = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // checking user exits or not
    if (!req.user)
        return next(new errorHandler_1.default("Bad Request", 400));
    // gete data from req body
    const { avatar, fullname, email } = req.body;
    const newFullName = ((_a = fullname === null || fullname === void 0 ? void 0 : fullname.charAt(0)) === null || _a === void 0 ? void 0 : _a.toUpperCase()) + (fullname === null || fullname === void 0 ? void 0 : fullname.slice(1));
    // let's find the user
    const user = yield userModel_1.default.findByIdAndUpdate(req.user._id, {
        avatar,
        fullname: newFullName,
        email,
    }, {
        new: true,
        useFindAndModify: true,
    });
    // checking user exits ot not
    if (!user)
        return next(new errorHandler_1.default("Bad Request", 400));
    //without password updatedAt createdAt _v send response to client
    const _b = user._doc, { password, __v, updatedAt, createdAt } = _b, userInfo = __rest(_b, ["password", "__v", "updatedAt", "createdAt"]);
    res.status(200).json({
        message: "Updated user profile successfully",
        user: userInfo,
    });
}));
//When any user try to visit any user profile fire this function
exports.singleUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userModel_1.default.findById(id);
    if (!user)
        return next(new errorHandler_1.default("User doesn't exits", 400));
    res.status(200).json({
        message: "true",
        user,
    });
}));
// When Any user try to change her password fire this function
exports.updatePassword = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return next(new errorHandler_1.default("Bad Request", 400));
    const { _id } = req.user;
    const user = yield userModel_1.default.findByIdAndUpdate(_id);
    const { oldPassword, newPassword } = req.body;
    if (!user)
        return next(new errorHandler_1.default("Bad Request", 400));
    const isPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isPasswordMatch)
        return next(new errorHandler_1.default("Invalid Password", 400));
    if (oldPassword === newPassword)
        return next(new errorHandler_1.default("It's your oldPassword ! try to enter new", 400));
    if ((newPassword === null || newPassword === void 0 ? void 0 : newPassword.length) < 8 || (newPassword === null || newPassword === void 0 ? void 0 : newPassword.length) > 32)
        return next(new errorHandler_1.default("Password must be between 8 and 32 characters", 400));
    const hashPassword = yield bcryptjs_1.default.hash(newPassword, 12);
    user.password = hashPassword;
    yield user.save();
    res.status(200).json({
        message: "Password Update successfully",
    });
}));
exports.resetPassword = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
}));
