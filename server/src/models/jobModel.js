const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String, // Tiểu đề ứng tuyển
      required: [true, "Please tell us your title"],
    },
    offer: String, // tiền offer
    address: {
      // Vị trí làm việc
      type: String,
      default: "Hà Nội City",
    },
    experience: String, // Kinh nghiệm
    deadline: Date, // Hạn
    position: String, // Vị trí ứng tuyển
    quantity: Number, // Số lượng cần ứng tuyển
    desc: String, // Mô tả
    type: String, // Hình thức công việc
    require: String, // Hình thức công việc
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
