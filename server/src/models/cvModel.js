const mongoose = require("mongoose");

const CVSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId, // Ứng cử viên
      ref: "User",
    },

    url: {
      type: String, // Link cv
      required: [true, "CV is required"],
    },

    job: {
      type: mongoose.Schema.ObjectId, // Công việc ứng tuyển
      ref: "Job",
    },

    status: {
      type: String,
      enum: ["pending", "viewed", "passed", "failed"],
    }, // Trạng thái
  },
  {
    timestamps: true,
  }
);

const CV = mongoose.model("CV", CVSchema);

module.exports = CV;
