import catchAsyncError from "../../middleware/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errorHandler";
import Blog from "../../models/blog/blogModel";
import { IReqAuth } from "../../utils/interface";
import mongoose from "mongoose";

// Pagination
const pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 3;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};

//When user try to create any blog fire this function
export const createBlog = catchAsyncError(
  async (req: IReqAuth, res: Response, next: NextFunction) => {
    if (!req.user) return next(new ErrorHandler("Invalid auth", 400));

    const { title, content, description, thumbnail, category } = req.body;

    const newBlog = new Blog({
      user: req.user._id,
      title,
      content,
      description,
      thumbnail,
      category,
    });

    await newBlog.save();

    res.status(201).json({
      message: "true",
      newBlog,
    });
  }
);

//When user requested home blog url fire this function
export const getHomeBlog = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogs = await Blog.aggregate([
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
  }
);

//When user try to get any specific  blog category fire this function
export const getBlogsByCategory = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { limit, skip } = pagination(req);
    const cool = new mongoose.Types.ObjectId(req.params.category_id);
    const data = await Blog.aggregate([
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

    if (!data) return next(new ErrorHandler("Not Found", 404));

    const blogs = data[0]?.totalData;
    const count = data[0]?.count;
    // Pagination
    let total = 0;
    if (count % limit === 0) total = count / limit;
    else total = Math.floor(count / limit) + 1;

    res.status(201).json({
      message: "true",
      blogs,
      total,
    });
  }
);

//When user try to visit any user profile show how much blog he post
export const getBlogsByUser = catchAsyncError(
  async (req: IReqAuth, res: Response, next: NextFunction) => {
    const { limit, skip } = pagination(req);
    const cool = new mongoose.Types.ObjectId(req.params.id);
    const data = await Blog.aggregate([
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

    if (!data) return next(new ErrorHandler("Not Found", 404));

    const blogs = data[0]?.totalData;
    const count = data[0]?.count;
    // Pagination
    let total = 0;
    if (count % limit === 0) total = count / limit;
    else total = Math.floor(count / limit) + 1;

    res.status(201).json({
      message: "true",
      blogs,
      total,
    });
  }
);

//When User try to get full blog details
export const getSingleBlog = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params.id)
    const blog = await Blog.findOne({ _id: req.params.id }).populate(
      "user",
      "-password"
    );
    if (!blog) return next(new ErrorHandler("Not found", 404));
    res.status(200).json({
      message: "true",
      blog,
    });
  }
);
