const Position = require("../models/positionModel");
const jwt = require("jsonwebtoken");

const generateActivationToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACTIVATION_KEY, {
    expiresIn: "15m",
  });
};

// Tạo accessToken
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_KEY, {
    expiresIn: "1d",
  });
};

// Tạo refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "365d",
  });
};

// Phần này sẽ là trả về thông tin người dùng, gắn refresh token cho token
const createSendToken = async (user, statusCode, req, res, message) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  let role = "";
  if (user?.position) {
    // Có vị trí thì là nhân viên, ko có thì là ứng cứ viên
    const position = await Position.findById(user?.position);
    role = position?.role;
  } else {
    role = "candidate";
  }

  res.cookie("refreshToken", refreshToken, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: '/'
  });
  user.password = undefined;
  const { password, ...others } = user._doc;
  res.status(statusCode).json({
    ...others,
    role,
    accessToken,
    status: "success",
    message,
  });
};

module.exports = {
  createSendToken,
  generateRefreshToken,
  generateAccessToken,
  generateActivationToken,
};
