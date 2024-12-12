const allowedOrigins = require("../config/allowedOrigins");

// Phần này set header cho các domain thỏa mãn
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
