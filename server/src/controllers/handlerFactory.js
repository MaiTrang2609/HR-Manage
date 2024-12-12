const catchAsync = require("./../middleware/catchAsync");
const AppError = require("./../utils/appError");
const handlerFactory = {
  // Tạo dữ liệu
  createOne: (Model) =>
    catchAsync(async (req, res, next) => {
      const data = await Model.create(req.body);
      res.status(200).json({
        status: "success",
        message: "Create success",
        data,
      });
    }),

  // tìm dữ liệu theo type
  getOne: (Model, type) =>
    catchAsync(async (req, res, next) => {
      let query = Model.findOne({ [type]: req.params.id });

      const data = await query;

      if (!data) {
        return next(new AppError("Document can't be found", 404));
      }

      res.status(200).json({
        status: "success",
        data,
      });
    }),

  // Tìm dữ liệu theo id
  getOneById: (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
      let query = Model.findById(req.params.id);

      if (popOptions) query = query.populate(popOptions); // Nối bảng

      const data = await query;

      if (!data) {
        return next(new AppError("Document can't be found", 404));
      }

      res.status(200).json({
        status: "success",
        data,
      });
    }),

  // Lấy toàn bộ danh sách, với type mặc định là name
  getAll: (Model, type = "name") =>
    catchAsync(async (req, res, next) => {
      const { search = "", page, limit } = req.query;
      // Xây dựng điều kiện tìm kiếm
      const query = search ? { [type]: { $regex: search, $options: "i" } } : {};
      // Đếm tổng số bản ghi theo điều kiện
      const total = await Model.countDocuments(query);
      // Khởi tạo truy vấn cơ bản
      let modelQuery = Model.find(query).sort({ createdAt: "desc" });
      // Áp dụng phân trang nếu có `page` và `limit`
      if (page !== undefined && limit !== undefined) {
        const skip = Number(page) * Number(limit);
        const limitValue = Number(limit);
        modelQuery = modelQuery.skip(skip).limit(limitValue);
      }
      // Thực hiện truy vấn
      const data = await modelQuery;
      // Trả kết quả
      res.status(200).json({
        status: "success",
        total,
        data,
      });
    }),

  // Hàm xóa dữ liệu
  deleteOne: (Model) =>
    catchAsync(async (req, res, next) => {
      const data = await Model.findByIdAndDelete(req.params.id);
      if (!data) {
        return next(new AppError("Document can't be found", 404));
      }

      res.status(200).json({
        status: "success",
        message: "Delete success",
      });
    }),

  // Xóa hết theo user đang đăng nhập, hàm này chưa dùng
  deleteAll: (Model) =>
    catchAsync(async (req, res, next) => {
      const data = await Model.deleteMany({ user: req.params.id, paid: true });

      if (!data) {
        return next(new AppError("Document can't be found", 404));
      }

      res.status(200).json({
        status: "success",
        message: "Delete success",
      });
    }),

  // Cập nhật dữ liệu
  updateOne: (Model) =>
    catchAsync(async (req, res, next) => {
      const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!data) {
        return next(new AppError("Document can't be found", 404));
      }

      res.status(200).json({
        status: "success",
        message: "Update success",
        data,
      });
    }),
};

module.exports = handlerFactory;
