"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = __importDefault(require("./middleware/error"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
// Routes
app.get('/', (req, res) => {
    res.send("Api Working");
});
// Internal Import Route
const authRoute_1 = __importDefault(require("./routes/auth/authRoute"));
const userRoute_1 = __importDefault(require("./routes/user/userRoute"));
const categoryRoute_1 = __importDefault(require("./routes/category/categoryRoute"));
const blogRoute_1 = __importDefault(require("./routes/blog/blogRoute"));
const commentRoute_1 = __importDefault(require("./routes/comment/commentRoute"));
app.use('/api/v1/auth', authRoute_1.default);
app.use('/api/v1/user', userRoute_1.default);
app.use('/api/v1/category', categoryRoute_1.default);
app.use('/api/v1/blog', blogRoute_1.default);
app.use('/api/v1/comment', commentRoute_1.default);
// Error Middleware
app.use(error_1.default);
exports.default = app;
