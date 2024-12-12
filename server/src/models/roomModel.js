const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      // Tên phòng
      type: String,
      required: [true, "Please tell us your name"],
    },

    color: String, // Màu sắc
    quantity: Number, // Số lượng
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
