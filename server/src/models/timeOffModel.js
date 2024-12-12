const mongoose = require("mongoose");

const timeOffSchema = new mongoose.Schema(
  {
    title: {
      type: String, 
      required: [true, "Please tell us your title"],
    },
    desc: String, 
    day: String, 
    timeStart: String, 
    timeEnd: String,

    annualLeave: {
      type: mongoose.Schema.ObjectId, 
      ref: "AnnualLeave",
    },
    userRequest: {
      type: mongoose.Schema.ObjectId, 
      ref: "User",
    },
    userAccept: {
      type: mongoose.Schema.ObjectId, 
      ref: "User",
    },
    status: {
      type: String, 
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
