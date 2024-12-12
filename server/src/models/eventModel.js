const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      // Mã sự kiện
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

    // Cái này dùng để xem chế độ lặp của lịch
    type: {
      type: String,
      enum: [1, 2, 3, 4, 5, 6, 7, 8], // Check ở bên trong client có khai báo
    },

    desc: String, // Mô tả

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Dùng để check xem nó thuộc thằng lịch nào nếu nó được lặp lại
    code: String,
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
