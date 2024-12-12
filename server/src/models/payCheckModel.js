const mongoose = require("mongoose");

const payCheckSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    gross: Number, 
    insurance: Number, 
    tax: Number, 
    net: Number, 
    day: Date,
  },
  {
    timestamps: true,
  }
);

const PayCheck = mongoose.model("PayCheck", payCheckSchema);

module.exports = PayCheck;
