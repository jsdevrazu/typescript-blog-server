import catchAsyncError from "../../middleware/catchAsyncError.js";
import ErrorHandler from "../../utils/errorHandler.js";
import Comment from "../../models/comment/commentModel.js";
import mongoose from "mongoose";

// Pagination
const pagination = (req) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 3;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};

// When user comment any post
export const createComment = catchAsyncError(
  async (req, res, next) => {
    if (!req.user) return next(new ErrorHandler("Invalid token", 400));
    const { content, blog_id, blog_user_id } = req.body;

    const newComment = new Comment({
      user: req.user._id,
      content,
      blog_id,
      blog_user_id,
    });

    await newComment.save();

    res.status(201).json({
      message: "true",
      data: newComment,
    });
  }
);

// When user comment any post
export const getComment = catchAsyncError(
  async (req, res, next) => {
    const { limit, skip } = pagination(req);
    const newComment = new mongoose.Types.ObjectId(req.params.id);
    const data = await Comment.aggregate([
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
          count:{ $arrayElemAt: ["$totalCount.count", 0]},
          totalData:1
        }
      }
    ]);

    const comments = data[0].totalData;
    const count = data[0].count;
    let total = 0;

    if(count % limit === 0) total = count / limit
    else total = Math.floor(count / limit) + 1

    res.status(200).json({
      message: "true",
      comments,
      total,
    });
  }
);
