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
exports.logout = exports.login = exports.verifyAccount = exports.register = void 0;
const catchAsyncError_1 = __importDefault(require("../../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const userModel_1 = __importDefault(require("../../models/user/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail/sendEmail"));
// When User Try Register In Our Site Fire this function
exports.register = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //get data from body
    const { fullname, email, password } = req.body;
    // Find or checking already any user extis with body email or not
    const user = yield userModel_1.default.findOne({ email });
    if (user)
        return next(new errorHandler_1.default("User Already Exits", 400));
    // Password Hash
    const passwordHash = yield bcryptjs_1.default.hash(password, 12);
    // if not create new user
    const newUser = new userModel_1.default({
        fullname,
        email,
        password: passwordHash,
    });
    // save the user and send db
    yield newUser.save();
    // generate a token
    const token = generateToken({ id: newUser._id });
    // Send Verify Email
    const CLIENT_URL = `${process.env.BASE_URL}`;
    const DEPLOY_URL = `${process.env.DEPLOY_URL}`;
    const url = `${CLIENT_URL || DEPLOY_URL}/active/${token}`;
    (0, sendEmail_1.default)(email, url, `Verify your email address`);
    res
        .cookie("token", token, {
        httpOnly: true,
    })
        .status(201)
        .json({
        message: "Register Successfully ! Please check your email and verify email",
        user: newUser,
        token,
    });
}));
// After Register we need to verify user account
exports.verifyAccount = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get token form body
    const { access_token } = req.body;
    // verify token
    const decoded = jsonwebtoken_1.default.verify(access_token, `${process.env.JWT_SECRET}`);
    const user = yield userModel_1.default.findById(decoded.id);
    // checking user exits otr not
    if (!user)
        return next(new errorHandler_1.default("Invalid credential", 400));
    // checking user account already verify or not
    if (user.isActive)
        return next(new errorHandler_1.default("Email already verify", 400));
    const token = generateToken({ id: user._id });
    // if not let's verify account and save the user
    user.isActive = true;
    yield user.save();
    //without password updatedAt createdAt _v send response to client
    const _a = user._doc, { password: myPassword, __v, updatedAt, createdAt } = _a, userInfo = __rest(_a, ["password", "__v", "updatedAt", "createdAt"]);
    res.status(200).json({
        message: "Email Verify Successfully",
        user: userInfo,
        token
    });
}));
// When User Try Login In Our Site Fire this function
exports.login = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get data from req body
    const { email, password } = req.body;
    // find user 
    const user = yield userModel_1.default.findOne({ email });
    if (!user)
        return next(new errorHandler_1.default("Invalid credentials", 400));
    // checking hash password
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordMatch)
        return next(new errorHandler_1.default("Invalid credentials", 400));
    // generate a user token
    const token = generateToken({ id: user._id });
    //without password updatedAt createdAt _v send response to client
    const _b = user._doc, { password: myPassword, __v, updatedAt, createdAt } = _b, userInfo = __rest(_b, ["password", "__v", "updatedAt", "createdAt"]);
    res
        .cookie("token", token, {
        httpOnly: true,
    })
        .status(201)
        .json({
        message: "Register Successfully ! Please check your email and verify email",
        user: userInfo,
        token,
    });
}));
// When User Try Logout In Our Site Fire this function
exports.logout = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res
        .clearCookie("token", {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
        .status(200)
        .json({
        message: "Logged Our Successfully",
        token: null,
        user: null,
    });
}));
// Generate a token
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
}
