"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
    blog_id: mongoose_1.default.Types.ObjectId,
    blog_user_id: mongoose_1.default.Types.ObjectId,
    content: { type: String, require: true },
    replyCM: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Comment",
        },
    ],
    reply_user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Comment", commentSchema);
