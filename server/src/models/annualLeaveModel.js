const mongoose = require("mongoose");

const annualLeaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId, 
      ref: "User",
    },

    listTimeOff: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "TimeOff",
      },
    ],
    total: Number, 
    remaining: Number, 
    year: {
      type: String,
      default: new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

const AnnualLeave = mongoose.model("AnnualLeave", annualLeaveSchema);

module.exports = AnnualLeave;
