const mongoose = require("mongoose");

const payCheckSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId, // Nhân viên
      ref: "User",
    },
    gross: Number, // Tổng thu nhập
    insurance: Number, // bảo hiểm
    tax: Number, // Tiền hỗ trợ
    net: Number, // Tiền thực nhận,
    day: Date, // Ngày tháng nhận lương
  },
  {
    timestamps: true,
  }
);

const PayCheck = mongoose.model("PayCheck", payCheckSchema);

module.exports = PayCheck;
