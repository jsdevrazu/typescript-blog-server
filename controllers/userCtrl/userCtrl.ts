import catchAsyncError from "../../middleware/catchAsyncError";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../../utils/errorHandler";
import { IReqAuth, IUser } from "../../utils/interface";
import User from "../../models/user/userModel";
import bcrypt from "bcryptjs";


//When any user try to update her profile fire this function
export const updateProfile = catchAsyncError(
  async (req: IReqAuth, res: Response, next: NextFunction) => {
    // checking user exits or not
    if (!req.user) return next(new ErrorHandler("Bad Request", 400));
    // gete data from req body
    const { avatar, fullname, email } = req.body;
    const newFullName = fullname?.charAt(0)?.toUpperCase() + fullname?.slice(1);
    // let's find the user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar,
        fullname: newFullName,
        email,
      },
      {
        new: true,
        useFindAndModify: true,
      }
    );
      // checking user exits ot not
    if (!user) return next(new ErrorHandler("Bad Request", 400));
        //without password updatedAt createdAt _v send response to client
    const { password, __v, updatedAt, createdAt, ...userInfo } =
      user._doc as IUser;

    res.status(200).json({
      message: "Updated user profile successfully",
      user: userInfo,
    });
  }
);

//When any user try to visit any user profile fire this function
export const singleUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("User doesn't exits", 400));

    res.status(200).json({
      message: "true",
      user,
    });
  }
);
// When Any user try to change her password fire this function
export const updatePassword = catchAsyncError(
  async (req: IReqAuth, res: Response, next: NextFunction) => {
    if (!req.user) return next(new ErrorHandler("Bad Request", 400));

    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id);
    const { oldPassword, newPassword } = req.body;

    if (!user) return next(new ErrorHandler("Bad Request", 400));

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch)
      return next(new ErrorHandler("Invalid Password", 400));

    if (oldPassword === newPassword)
      return next(
        new ErrorHandler("It's your oldPassword ! try to enter new", 400)
      );

    if (newPassword?.length < 8 || newPassword?.length > 32)
      return next(
        new ErrorHandler("Password must be between 8 and 32 characters", 400)
      );

    const hashPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashPassword;

    await user.save();

    res.status(200).json({
      message: "Password Update successfully",
    });
  }
);

export const resetPassword = catchAsyncError(
  async (req: IReqAuth, res: Response, next: NextFunction) => {


    
  }
);
