const mongoose = require("mongoose");

const timeOffSchema = new mongoose.Schema(
  {
    title: {
      type: String, // Tiêu đề
      required: [true, "Please tell us your title"],
    },
    desc: String, // Mô tả
    day: String, // Ngày nghỉ
    timeStart: String, // Ca nghỉ
    timeEnd: String, // Ca nghỉ

    annualLeave: {
      type: mongoose.Schema.ObjectId, // Thuộc của người nào
      ref: "AnnualLeave",
    },
    userRequest: {
      type: mongoose.Schema.ObjectId, // Người đề xuất
      ref: "User",
    },
    userAccept: {
      type: mongoose.Schema.ObjectId, // Người chấp thuận
      ref: "User",
    },
    status: {
      type: String, // Trạng thái
      default: "pending",
      enum: ["pending", "accept", "reject"],
    },
  },
  {
    timestamps: true,
  }
);

const TimeOff = mongoose.model("TimeOff", timeOffSchema);

module.exports = TimeOff;
