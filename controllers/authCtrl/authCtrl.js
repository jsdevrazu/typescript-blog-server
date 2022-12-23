import catchAsyncError from "../../middleware/catchAsyncError.js";
import ErrorHandler from "../../utils/errorHandler.js";
import User from "../../models/user/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../utils/sendEmail/sendEmail.js";


// When User Try Register In Our Site Fire this function
export const register = catchAsyncError(
  async (req, res, next) => {
    //get data from body
    const { fullname, email, password } = req.body;
    // Find or checking already any user extis with body email or not
    const user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User Already Exits", 400));
    // Password Hash
    const passwordHash = await bcrypt.hash(password, 12);
    // if not create new user
    const newUser = new User({
      fullname,
      email,
      password: passwordHash,
    });
    // save the user and send db
    await newUser.save();
    // generate a token
    const token = generateToken({ id: newUser._id });

    // Send Verify Email
    const CLIENT_URL = `${process.env.BASE_URL}`;
    const DEPLOY_URL = `${process.env.DEPLOY_URL}`;
    const url = `${CLIENT_URL || DEPLOY_URL}/active/${token}`;
    sendEmail(email, url, `Verify your email address`);

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(201)
      .json({
        message:
          "Register Successfully ! Please check your email and verify email",
        user: newUser,
        token,
      });
  }
);


// After Register we need to verify user account
export const verifyAccount = catchAsyncError(
  async (req, res, next) => {
    // get token form body
    const { access_token } = req.body;
    // verify token
    const decoded = jwt.verify(
      access_token,
      `${process.env.JWT_SECRET}`
    );
    const user = await User.findById(decoded.id);
      // checking user exits otr not
    if (!user) return next(new ErrorHandler("Invalid credential", 400));
    // checking user account already verify or not
    if (user.isActive)
      return next(new ErrorHandler("Email already verify", 400));
      const token = generateToken({ id: user._id });
      // if not let's verify account and save the user
    user.isActive = true;

    await user.save();
      //without password updatedAt createdAt _v send response to client
    const {
      password: myPassword,
      __v,
      updatedAt,
      createdAt,
      ...userInfo
    } = user._doc

    res.status(200).json({
      message: "Email Verify Successfully",
      user:userInfo,
      token
    });
  }
);


// When User Try Login In Our Site Fire this function
export const login = catchAsyncError(
  async (req, res, next) => {
    // get data from req body
    const { email, password } = req.body;
    // find user 
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("Invalid credentials", 400));
    // checking hash password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return next(new ErrorHandler("Invalid credentials", 400));
    // generate a user token
    const token = generateToken({ id: user._id });
  //without password updatedAt createdAt _v send response to client
    const {
      password: myPassword,
      __v,
      updatedAt,
      createdAt,
      ...userInfo
    } = user._doc

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(201)
      .json({
        message:
          "Register Successfully ! Please check your email and verify email",
        user: userInfo,
        token,
      });
  }
);


// When User Try Logout In Our Site Fire this function
export const logout = catchAsyncError(
  async (req, res, next) => {
    res
      .clearCookie("token", {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Logged Our Successfully",
        token: null,
        user: null,
      });
  }
);

// Generate a token
function generateToken(payload) {
  return jwt.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
}
