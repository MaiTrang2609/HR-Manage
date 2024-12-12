const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String, 
      required: [true, "Name is required"],
    },
    quantity: {
      type: Number,
      default: 0,
    },
    desc: String, 
    leader: {
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
