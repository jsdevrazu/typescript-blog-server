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
exports.getSingleBlog = exports.getBlogsByUser = exports.getBlogsByCategory = exports.getHomeBlog = exports.createBlog = void 0;
const catchAsyncError_1 = __importDefault(require("../../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const blogModel_1 = __importDefault(require("../../models/blog/blogModel"));
const mongoose_1 = __importDefault(require("mongoose"));
// Pagination
const pagination = (req) => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 3;
    let skip = (page - 1) * limit;
    return { page, limit, skip };
};
//When user try to create any blog fire this function
exports.createBlog = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return next(new errorHandler_1.default("Invalid auth", 400));
    const { title, content, description, thumbnail, category } = req.body;
    const newBlog = new blogModel_1.default({
        user: req.user._id,
        title,
        content,
        description,
        thumbnail,
        category,
    });
    yield newBlog.save();
    res.status(201).json({
        message: "true",
        newBlog,
    });
}));
//When user requested home blog url fire this function
exports.getHomeBlog = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogModel_1.default.aggregate([
        // User
        {
            $lookup: {
                from: "users",
                let: { user_id: "$user" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                    { $project: { password: 0 } },
                ],
                as: "user",
            },
        },
        // Convert Array to Object
        { $unwind: "$user" },
        // Category
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        { $unwind: "$category" },
        //Sorting
        { $sort: { createdAt: -1 } },
        // Group By category
        {
            $group: {
                _id: "$category._id",
                name: { $first: "$category.name" },
                blogs: { $push: "$$ROOT" },
                count: { $sum: 1 },
            },
        },
        // Pagination For Blog
        {
            $project: {
                blogs: {
                    $slice: ["$blogs", 0, 3],
                },
                count: 1,
                name: 1,
            },
        },
    ]);
    res.status(201).json({
        message: "true",
        blogs,
    });
}));
//When user try to get any specific  blog category fire this function
exports.getBlogsByCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { limit, skip } = pagination(req);
    const cool = new mongoose_1.default.Types.ObjectId(req.params.category_id);
    const data = yield blogModel_1.default.aggregate([
        {
            $facet: {
                totalData: [
                    { $match: { category: cool } },
                    {
                        $lookup: {
                            from: "users",
                            let: { user_id: "$user" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                { $project: { password: 0 } },
                            ],
                            as: "user",
                        },
                    },
                    // Convert Array to Object
                    { $unwind: "$user" },
                    //Sorting
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                ],
                totalCount: [{ $match: { category: cool } }, { $count: "count" }],
            },
        },
        {
            $project: {
                count: { $arrayElemAt: ["$totalCount.count", 0] },
                totalData: 1,
            },
        },
    ]);
    if (!data)
        return next(new errorHandler_1.default("Not Found", 404));
    const blogs = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.totalData;
    const count = (_b = data[0]) === null || _b === void 0 ? void 0 : _b.count;
    // Pagination
    let total = 0;
    if (count % limit === 0)
        total = count / limit;
    else
        total = Math.floor(count / limit) + 1;
    res.status(201).json({
        message: "true",
        blogs,
        total,
    });
}));
//When user try to visit any user profile show how much blog he post
exports.getBlogsByUser = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { limit, skip } = pagination(req);
    const cool = new mongoose_1.default.Types.ObjectId(req.params.id);
    const data = yield blogModel_1.default.aggregate([
        {
            $facet: {
                totalData: [
                    { $match: { user: cool } },
                    {
                        $lookup: {
                            from: "users",
                            let: { user_id: "$user" },
                            pipeline: [
                                { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                { $project: { password: 0 } },
                            ],
                            as: "user",
                        },
                    },
                    // Convert Array to Object
                    { $unwind: "$user" },
                    //Sorting
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                ],
                totalCount: [{ $match: { user: cool } }, { $count: "count" }],
            },
        },
        {
            $project: {
                count: { $arrayElemAt: ["$totalCount.count", 0] },
                totalData: 1,
            },
        },
    ]);
    if (!data)
        return next(new errorHandler_1.default("Not Found", 404));
    const blogs = (_c = data[0]) === null || _c === void 0 ? void 0 : _c.totalData;
    const count = (_d = data[0]) === null || _d === void 0 ? void 0 : _d.count;
    // Pagination
    let total = 0;
    if (count % limit === 0)
        total = count / limit;
    else
        total = Math.floor(count / limit) + 1;
    res.status(201).json({
        message: "true",
        blogs,
        total,
    });
}));
//When User try to get full blog details
exports.getSingleBlog = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    const blog = yield blogModel_1.default.findOne({ _id: req.params.id }).populate("user", "-password");
    if (!blog)
        return next(new errorHandler_1.default("Not found", 404));
    res.status(200).json({
        message: "true",
        blog,
    });
}));
