"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        require: true,
        trim: true,
    },
    content: {
        type: String,
        require: true,
        trim: true,
    },
    description: {
        type: String,
        require: true,
        trim: true,
    },
    thumbnail: {
        type: String,
        require: true,
        trim: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Blog", blogSchema);
