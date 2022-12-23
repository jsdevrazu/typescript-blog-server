import catchAsyncError from "../catchAsyncError.js";
import ErrorHandler from "../../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../../models/user/userModel.js";


export const isAuthenticated = catchAsyncError(
  async (req, res, next) => {
    const token =
      req.headers.authorization?.split("Bearer ")[1] || req.cookies.token;

    if (!token)
      return next(
        new ErrorHandler("Invalid authorization token. please try again", 400)
      );

    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`
    );

    const user = await User.findById(decoded.id);
    if (!user)
      return next(
        new ErrorHandler("Invalid authorization token. please try again", 400)
      );

    req.user = user;

    next();
  }
);
