const AppError = require("../utils/appError");
const catchAsync = require("./catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Fuction này thì đa số chạy sau function ở dưới (Kiểm tra quyền của user)
// Đầu vào là các roles được phép truy cập
// vì đây là 1 dạng fuction chạy trc fuction chính nên next() - thỏa mãn điều kiện chạy luôn vào fuction chính
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // Nếu là admin thì vô đối
    if (req.user.position?.role === "admin") {
      return next();
    }
    // Kiểm tra role của user có thuộc roles ở trên không
    if (!roles.includes(req.user.position?.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };

// Kiểm tra người dùng đã login hay chưa
exports.isAuthenticatedUser = catchAsync(async (req, res, next) => {
  let token;
  // lấy token
  if (req.headers.token && req.headers.token.startsWith("Bearer")) {
    token = req.headers.token?.split(" ")?.[1];
  }
  // Không có token là người dùng chưa đăng nhập, trả lỗi
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
  // Giã mã token
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
  // Tìm user và nối với bảng Position để lấy role của nó
  const currentUser = await User.findById(decoded.id).populate({
    path: "position",
    select: "role",
  });

  // Không có chứng tỏ user đã bị xóa ....
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  // Phần này kiểm tra khoảng thời gian user đổi pass có thỏa mãn ko
  if (currentUser.changesPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again!", 401)
    );
  }

  // Gắn user
  req.user = currentUser;
  next();
});
