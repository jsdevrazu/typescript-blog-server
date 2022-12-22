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
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const catchAsyncError_1 = __importDefault(require("../../middleware/catchAsyncError"));
const errorHandler_1 = __importDefault(require("../../utils/errorHandler"));
const categoryModel_1 = __importDefault(require("../../models/catgory/categoryModel"));
//When Admin try to create any new category fire this function
exports.createCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Checking admin already exits or not
    if (!req.user)
        return next(new errorHandler_1.default("Bad Request", 400));
    // verify Admin role
    if (req.user.role !== "admin")
        return next(new errorHandler_1.default("You are not able to access this", 400));
    const name = req.body.name.toLowerCase();
    //Checking already category exits ot not
    const category = yield categoryModel_1.default.findOne({ name });
    if (category)
        return next(new errorHandler_1.default("This category already exits", 400));
    //   If not any category match then crete new
    const newCategory = new categoryModel_1.default({ name });
    yield newCategory.save();
    res.status(201).json({
        message: "true",
        newCategory,
    });
}));
// When Any User requires to category fire this function
exports.getCategories = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get All categories form db
    const categories = yield categoryModel_1.default.find({});
    res.status(200).json({
        message: "true",
        categories,
    });
}));
//When Admin try to update any category fire this function
exports.updateCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Checking admin already exits or not
    if (!req.user)
        return next(new errorHandler_1.default("Bad Request", 400));
    // verify Admin role
    if (req.user.role !== "admin")
        return next(new errorHandler_1.default("You are not able to access this", 400));
    // If admin can write uppercase category let's convert to lowercase
    const name = req.body.name.toLowerCase();
    // Then Update this category
    const category = yield categoryModel_1.default.findByIdAndUpdate(req.params.id, { name }, {
        new: true,
        useFindAndModify: true,
    });
    // If any category doesn't exits return
    if (!category)
        return next(new errorHandler_1.default("Bad Requested", 400));
    res.status(200).json({
        message: "Update Successfully",
        category
    });
}));
//When Admin try to delete any category fire this function
exports.deleteCategory = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Checking admin already exits or not
    if (!req.user)
        return next(new errorHandler_1.default("Bad Request", 400));
    // verify Admin role
    if (req.user.role !== "admin")
        return next(new errorHandler_1.default("You are not able to access this", 400));
    // get id from params and delete the category
    const category = yield categoryModel_1.default.findByIdAndDelete(req.params.id);
    // If any category doesn't exits return
    if (!category)
        return next(new errorHandler_1.default("Bad Requested", 400));
    res.status(200).json({
        message: "Delete Successfully",
    });
}));
