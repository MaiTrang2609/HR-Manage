const catchAsync = require("../middleware/catchAsync");
const PayCheck = require("../models/payCheckModel");
const factory = require("./handlerFactory");

const payCheckController = {
  // Lấy toàn bộ danh sách paycheck
  getListPayCheck: catchAsync(async (req, res, next) => {
    const { search = "", page, limit } = req.query;
    // Xây dựng query filter cho PayCheck
    const query = {};
    // Tìm kiếm theo tên user nếu có `search`
    const userFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};
    // Đếm tổng số bản ghi theo filter
    const total = await PayCheck.countDocuments(query);
    // Khởi tạo truy vấn cơ bản
    let paycheckQuery = PayCheck.find(query)
      .sort({ createdAt: "desc" }) // Sắp xếp theo thời gian
      .populate({
        path: "user",
        select: "name division",
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
      paycheckQuery = paycheckQuery.skip(skip).limit(limitValue);
    }
    // Thực hiện truy vấn
    const data = await paycheckQuery;
    // Trả kết quả
    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  // Tương tự trên nhưng có thêm bộ lọc user : id của người đang đăng nhập
  getMyPayCheck: catchAsync(async (req, res, next) => {
    let data = {};
    const total = await PayCheck.countDocuments({ user: req.user?._id }); //
    if (req.query) {
      const search = req.query.search || "";
      data = await PayCheck.find({ user: req.user?._id }) //
        .sort({ createdAt: "desc" })
        .skip(req.page)
        .limit(req.limit)
        .populate({
          path: "user",
          select: "name division",
          match: { name: { $regex: search, $options: "i" } },
          populate: {
            path: "division",
            select: "name ",
          },
        });
    } else {
      data = await PayCheck.find().sort({ createdAt: "desc" });
    }
    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  getPayCheck: factory.getOne(PayCheck, "_id"),

  createPayCheck: factory.createOne(PayCheck),

  updatePayCheck: factory.updateOne(PayCheck),

  deletePayCheck: factory.deleteOne(PayCheck),
};

module.exports = payCheckController;
