const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please tell us your title"],
    },
    offer: String, 
    address: {
      type: String,
      default: "Hà Nội City",
    },
    experience: String, 
    deadline: Date, 
    position: String, 
    quantity: Number, 
    desc: String, 
    type: String, 
    require: String, 
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
