const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    title: {
      // Viết tắt tên vị trí
      type: String,
      required: [true, "Please tell us your title"],
    },
    name: String, // Tên vị trí
    role: {
      // Danh sách quyền tương ứng
      type: String,
      enum: ["admin", "hr", "dm", "pm", "employee", "outsite"],
    },
    desc: String,
  },
  {
    timestamps: true,
  }
);

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;
