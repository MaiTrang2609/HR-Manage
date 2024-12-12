const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("../middleware/catchAsync");
const AppError = require("../utils/appError");

const {
  createSendToken,
  generateAccessToken,
  generateActivationToken,
} = require("../utils/jwtToken");

const CLIENT_URL = process.env.CLIENT_URL;
// const CLIENT_URL = "http://localhost:3000";

const authController = {
  // Hàm login
  login: catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Incorrect email ", 401));
    }

    if (!(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect password", 401));
    }
    createSendToken(user, 200, req, res, (message = "Login success"));
  }),

  // Đăng nhập bằng google
  googleAuth: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const data = await User.create({ ...req.body, role: "candidate" });
      return createSendToken(data, 201, req, res, (message = "Signup success"));
    }
    createSendToken(user, 200, req, res, (message = "Login success"));
  }),

  // Đăng kí , tạo thành tk của ứng cử viên

  signup: catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return next(new AppError("Email has been created ", 401));
    }

    const data = await User.create({ ...req.body, role: "candidate" });
    createSendToken(data, 201, req, res, (message = "Signup success"));
  }),

  // Hàm tạo access token thông qua refresh token
  requestRefreshToken: catchAsync(async (req, res, next) => {
    // Thêm console.log để debug
    console.log("Cookie received:", req.cookies);
    
    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh token:", refreshToken);
    
    if (!refreshToken) {
      return next(new AppError("No refresh token found", 401));
    }
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
      console.log("Decoded token:", decoded);
      
      const currentUser = await User.findById(decoded.id);
      console.log("Found user:", currentUser);
      
      if (!currentUser) {
        return next(new AppError("User not found", 401));
      }
  
      const newAccessToken = generateAccessToken(currentUser);
      res.status(200).json({ accessToken: newAccessToken });
      
    } catch (err) {
      console.log("Token verification error:", err);
      return next(new AppError("Invalid or expired token", 401));
    }
  }),

  // hàm logout
  logout: (req, res, next) => {
    res.clearCookie("refreshToken");
    res.status(200).json({ status: "success", message: "You are loggedout" });
  },

  // Hàm cập nhật mật khẩu
  updatePassword: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, req, res, (message = "Update password success"));
  }),

  // tạo 1 email gửi về để thay đổi mk
  forgotPassword: catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return next(new AppError("No user found with that Email", 404));
    }
    if (!user.password) {
      return next(
        new AppError("Just login by button google login in login page ", 404)
      );
    }
    await user.save({ validateBeforeSave: false });

    const activation_token = generateActivationToken({ id: user._id });
    const url = `${CLIENT_URL}/user/reset/${activation_token}`;

    sendMail(res, req.body.email, url, "Check your email to reset");
  }),

  // Từ email ta có token từ đó thay đổi mk
  resetPassword: catchAsync(async (req, res, next) => {
    const { activation_token } = req.body;
    const decoded = jwt.verify(
      activation_token,
      process.env.JWT_ACTIVATION_KEY
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("Token is invaild or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();
    createSendToken(
      user,
      200,
      req,
      res,
      (message = "Password successfully changed!")
    );
  }),
};

module.exports = authController;
