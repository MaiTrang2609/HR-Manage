const catchAsync = require("../middleware/catchAsync");
const Event = require("../models/eventModel");
const factory = require("./handlerFactory");
const {
  getFirstDayOfPreviousMonth,
  getLastDayOfNextMonth,
} = require("../utils/utils");
const { insertEvent, deleteEvent } = require("../utils/google_calendar");
const eventController = {
  // Lấy danh sách event : dựa theo 3 tháng gần đây
  getListEvent: catchAsync(async (req, res, next) => {
    const { date } = req.query;

    const query = {
      timeStart: {
        $gte: getFirstDayOfPreviousMonth(date), // Ngày đầu tháng trc
        $lte: getLastDayOfNextMonth(date), // Ngày cuối tháng sau
      },
    };

    const data = await Event.find(query);

    res.status(200).json({
      status: "success",
      data,
    });
  }),

  getEvent: factory.getOne(Event, "_id"),

  createEvent: catchAsync(async (req, res, next) => {
    let event = req.body;

    event = {
      ...event,
      host: req.user._id,
      code: req.user._id + "-" + new Date().getTime(), // phần này để phân biết các event
    };
    insertEvent();
    const data = await Event.create(event);
    res.status(200).json({
      status: "success",
      message: "Create success",
      data,
    });
  }),

  updateEvent: factory.updateOne(Event),

  deleteEvent: factory.deleteOne(Event),

  getMyEvent: catchAsync(async (req, res, next) => {
    // Tương tự lấy danh sách event thì hàm này thêm bộ lọc usersOptional, usersRequired, host : id của người đang đăng nhập
    const { date } = req.query;
    const userId = req.user?._id;
    const query = {
      $or: [
        { usersOptional: { $in: [userId] } },
        { usersRequired: { $in: [userId] } },
        { host: userId },
      ],
      timeStart: { $gte: getFirstDayOfPreviousMonth(date) },
      timeEnd: { $lte: getLastDayOfNextMonth(date) },
    };

    const data = await Event.find(query).populate({
      path: "room",
      select: "color",
    });

    res.status(200).json({
      status: "success",
      data,
    });
  }),
};

module.exports = eventController;
