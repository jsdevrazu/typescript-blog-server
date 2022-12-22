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
exports.getComment = exports.createComment = void 0;
const catchAsyncError_1 = __importDefault(require("../../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const commentModel_1 = __importDefault(require("../../models/comment/commentModel"));
const mongoose_1 = __importDefault(require("mongoose"));
// Pagination
const pagination = (req) => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 3;
    let skip = (page - 1) * limit;
    return { page, limit, skip };
};
// When user comment any post
exports.createComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return next(new errorHandler_1.default("Invalid token", 400));
    const { content, blog_id, blog_user_id } = req.body;
    const newComment = new commentModel_1.default({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
    });
    yield newComment.save();
    res.status(201).json({
        message: "true",
        data: newComment,
    });
}));
// When user comment any post
exports.getComment = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, skip } = pagination(req);
    const newComment = new mongoose_1.default.Types.ObjectId(req.params.id);
    const data = yield commentModel_1.default.aggregate([
        {
            $facet: {
                totalData: [
                    { $match: { blog_id: newComment } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                    { $sort: { createAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                ],
                totalCount: [
                    { $match: { blog_id: newComment } },
                    { $count: "count" },
                ],
            },
        },
        {
            $project: {
                count: { $arrayElemAt: ["$totalCount.count", 0] },
                totalData: 1
            }
        }
    ]);
    const comments = data[0].totalData;
    const count = data[0].count;
    let total = 0;
    if (count % limit === 0)
        total = count / limit;
    else
        total = Math.floor(count / limit) + 1;
    res.status(200).json({
        message: "true",
        comments,
        total,
    });
}));
