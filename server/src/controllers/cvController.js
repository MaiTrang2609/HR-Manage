const catchAsync = require("../middleware/catchAsync");
const CV = require("../models/cvModel");
const factory = require("./handlerFactory");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const CVController = {
  // Lấy toàn bộ cv
  getListCV: catchAsync(async (req, res, next) => {
    const { job, status, page, limit } = req.query;
    const conditions = {};
    if (job) conditions.job = job; // Tìm CV theo job
    if (status) conditions.status = status; // Tìm CV theo status

    // Phân trang
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const data = await CV.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(pageSize)
      .populate({
        // Nối bảng job
        path: "job",
        select: "title deadline",
      })
      .populate({
        // Nối bản user
        path: "user",
        select: "name email phone",
      });

    // Đếm số lượng CV
    const total = await CV.countDocuments(conditions);

    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  getMyCV: catchAsync(async (req, res, next) => {
    const { job, status, page, limit } = req.query;
    const conditions = {};
    if (job) conditions.job = job; // Tìm CV theo job
    if (status) conditions.status = status; // Tìm CV theo status

    // Tương tự ở trên nhưng hàm find ta có thêm conditions.user : id của người đang đăng nhập
    conditions.user = new ObjectId(req.user._id);

    // Phân trang
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const data = await CV.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(pageSize)
      .populate({
        path: "job",
        select: "title deadline",
      })
      .populate({
        path: "user",
        select: "name email phone",
      });

    // Đếm số lượng CV
    const total = await CV.countDocuments(conditions);

    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  getCV: factory.getOne(CV),

  createCV: factory.createOne(CV),

  updateCV: factory.updateOne(CV),

  deleteCV: factory.deleteOne(CV),
};

module.exports = CVController;
