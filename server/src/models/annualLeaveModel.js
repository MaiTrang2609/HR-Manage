const mongoose = require("mongoose");

const annualLeaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId, // Mã nhân viên
      ref: "User",
    },

    listTimeOff: [
      // Danh sách phiếu nghỉ
      {
        type: mongoose.Schema.ObjectId,
        ref: "TimeOff",
      },
    ],
    total: Number, // Tổng ngày nghỉ
    remaining: Number, // Số lượng còn lại
    year: {
      type: String,
      default: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

const AnnualLeave = mongoose.model("AnnualLeave", annualLeaveSchema);

module.exports = AnnualLeave;
