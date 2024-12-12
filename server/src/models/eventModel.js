const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please tell us your title"],
    },

    usersOptional: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    usersRequired: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    timeStart: Date,
    timeEnd: Date,

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },

    type: {
      type: String,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
    },

    desc: String, 
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    code: String,
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
