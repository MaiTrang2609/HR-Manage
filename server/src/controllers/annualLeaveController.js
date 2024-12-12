const catchAsync = require("../middleware/catchAsync");
const AnnualLeave = require("../models/annualLeaveModel");
const factory = require("./handlerFactory");

const annualLeaveController = {
  // Lấy danh sách của lịch nghỉ
  getListAnnualLeave: catchAsync(async (req, res, next) => {
    const { search = "", page, limit } = req.query;
    // Xây dựng query filter
    const query = {};
    // Tìm kiếm theo tên trong bảng user
    const userFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};
    // Đếm tổng số bản ghi theo filter
    const total = await AnnualLeave.countDocuments(query);

    // Khởi tạo truy vấn cơ bản
    let leaveQuery = AnnualLeave.find(query)
      .sort({ createdAt: "desc" }) // Sắp xếp theo thời gian
      .populate({
        path: "user",
        select: "name nickName division",
        match: userFilter,
        populate: {
          path: "division",
          select: "name",
        },
      });
    // Áp dụng phân trang nếu có `page` và `limit`
    if (page !== undefined && limit !== undefined) {
      const skip = Number(page) * Number(limit);
      const limitValue = Number(limit);
      leaveQuery = leaveQuery.skip(skip).limit(limitValue);
    }
    // Thực hiện truy vấn
    const data = await leaveQuery;
    // Trả kết quả
    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  getAnnualLeave: factory.getOne(AnnualLeave, "_id"),

  // Lấy lịch nghỉ của user thông qua id rồi lại nối bảng để lấy thông tin
  getAnnualLeaveOfUser: catchAsync(async (req, res, next) => {
    const data = await AnnualLeave.findOne({ user: req.params.id }).populate({
      path: "user",
      select: "name nickName division",
      populate: {
        path: "division",
        select: "name ",
      },
    });

    res.status(200).json({
      status: "success",
      data,
    });
  }),

  createAnnualLeave: factory.createOne(AnnualLeave),

  updateAnnualLeave: factory.updateOne(AnnualLeave),

  deleteAnnualLeave: factory.deleteOne(AnnualLeave),
};

module.exports = annualLeaveController;
