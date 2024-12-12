const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please tell us your title"],
    },

    desc: String, 
    type: String, 
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
