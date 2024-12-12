const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please tell us your title"],
    },
    name: String, 
    role: {
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
