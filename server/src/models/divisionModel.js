const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Tên bộ phận
      required: [true, "Name is required"],
    },
    quantity: {
      // Số lượng nhân viên trong bộ phận
      type: Number,
      default: 0,
    },
    desc: String, // Mô tả bộ phận
    leader: {
      // Mã nhân viên làm DM
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Division = mongoose.model("Division", divisionSchema);

module.exports = Division;
