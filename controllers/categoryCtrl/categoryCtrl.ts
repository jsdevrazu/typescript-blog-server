import catchAsyncError from "../../middleware/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errorHandler";
import Category from "../../models/catgory/categoryModel";
import { IReqAuth } from "../../utils/interface";

//When Admin try to create any new category fire this function
export const createCategory = catchAsyncError(
  async (req: IReqAuth, res: Response, next: NextFunction) => {
    //Checking admin already exits or not
    if (!req.user) return next(new ErrorHandler("Bad Request", 400));
    // verify Admin role
    if (req.user.role !== "admin")
      return next(new ErrorHandler("You are not able to access this", 400));

    const name = req.body.name.toLowerCase();
    //Checking already category exits ot not
    const category = await Category.findOne({ name });
    if (category)
      return next(new ErrorHandler("This category already exits", 400));
    //   If not any category match then crete new
    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({
      message: "true",
      newCategory,
    });
  }
);

// When Any User requires to category fire this function
export const getCategories = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // get All categories form db
    const categories = await Category.find({});
    res.status(200).json({
      message: "true",
      categories,
    });
  }
);

//When Admin try to update any category fire this function
export const updateCategory = catchAsyncError(
  async (req: IReqAuth, res: Response, next: NextFunction) => {
    //Checking admin already exits or not
    if (!req.user) return next(new ErrorHandler("Bad Request", 400));
    // verify Admin role
    if (req.user.role !== "admin")
      return next(new ErrorHandler("You are not able to access this", 400));
    // If admin can write uppercase category let's convert to lowercase
    const name = req.body.name.toLowerCase();
    // Then Update this category
    const category = await Category.findByIdAndUpdate(req.params.id, {name}, {
      new: true,
      useFindAndModify: true,
    });
    // If any category doesn't exits return
    if (!category) return next(new ErrorHandler("Bad Requested", 400));

    res.status(200).json({
      message: "Update Successfully",
      category
    });
  }
);
//When Admin try to delete any category fire this function
export const deleteCategory = catchAsyncError(
  async (req: IReqAuth, res: Response, next: NextFunction) => {
    //Checking admin already exits or not
    if (!req.user) return next(new ErrorHandler("Bad Request", 400));
    // verify Admin role
    if (req.user.role !== "admin")
      return next(new ErrorHandler("You are not able to access this", 400));
    // get id from params and delete the category
    const category = await Category.findByIdAndDelete(req.params.id);
    // If any category doesn't exits return
    if (!category) return next(new ErrorHandler("Bad Requested", 400));
    res.status(200).json({
      message: "Delete Successfully",
    });
  }
);
