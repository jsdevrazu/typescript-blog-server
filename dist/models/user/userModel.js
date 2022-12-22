"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: [true, "Please enter full name"],
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        validate: [validator_1.default.isEmail, 'invalid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
    },
    role: {
        type: String,
        default: "user",
        enum: ['user', 'admin']
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model("User", userSchema);
