const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    title: {
      // Title của email
      type: String,
      required: [true, "Please tell us your title"],
    },

    desc: String, // Mô tả
    type: String, // Hình thức công việc
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
