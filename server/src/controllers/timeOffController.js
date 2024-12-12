const AppError = require("./../utils/appError");
const catchAsync = require("../middleware/catchAsync");
const TimeOff = require("../models/timeOffModel");
const AnnualLeave = require("../models/annualLeaveModel");
const factory = require("./handlerFactory");

const timeOffController = {
  // Lấy toàn bộ danh sách time off
  getListTimeOff: catchAsync(async (req, res, next) => {
    const total = await TimeOff.countDocuments();

    const data = await TimeOff.find().sort({ createdAt: "desc" }).populate({
      path: "userAccept",
      select: "name",
    });

    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  // Lấy danh sách time off của user thông qua bộ lọc userRequest : id của user trên params
  getListTimeOffUser: catchAsync(async (req, res, next) => {
    const total = await TimeOff.countDocuments({ userRequest: req.params.id });

    const data = await TimeOff.find({ userRequest: req.params.id })
      .sort({ createdAt: "desc" })
      .populate({
        path: "userAccept",
        select: "name",
      });

    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  // Lấy danh sách time off của user thông qua bộ lọc userAccept : id của user trên params

  // Cái này dành cho DM quản lý danh sách time off của bộ phận mình

  getListTimeOffRequest: catchAsync(async (req, res, next) => {
    const total = await TimeOff.countDocuments({ userAccept: req.user?._id });

    const data = await TimeOff.find({ userAccept: req.user?._id })
      .sort({ createdAt: "desc" })
      .populate({
        path: "userAccept",
        select: "name",
      });

    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  getTimeOff: factory.getOne(TimeOff, "_id"),

  createTimeOff: factory.createOne(TimeOff),

  updateTimeOff: catchAsync(async (req, res, next) => {
    if (req.body.status === "accept") {
      const annualLeave = await AnnualLeave.findOne({
        user: req.body.userRequest,
      });

      if (!annualLeave) {
        return next(new AppError("Document can't be found", 404));
      }

      const timeStart = new Date(req.body.timeStart).getTime();
      const timeEnd = new Date(req.body.timeEnd).getTime();

      const remaining =
        annualLeave.remaining - (timeEnd - timeStart) / 3600000 / 8;
      await AnnualLeave.findByIdAndUpdate(
        annualLeave?._id,
        {
          $set: { remaining },
        },
        { new: true, runValidators: true }
      );
    }

    const data = await TimeOff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "Update success",
      data,
    });
  }),

  deleteTimeOff: factory.deleteOne(TimeOff),
};

module.exports = timeOffController;
