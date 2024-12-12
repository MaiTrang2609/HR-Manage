const User = require("../models/userModel");
const Division = require("../models/divisionModel");
const catchAsync = require("../middleware/catchAsync");
const AppError = require("./../utils/appError");

const divisionController = {
  // Tạo divission
  //  Tìm user được gắn là role DM
  // Nếu  user đó đang là DM của div A thì div A phải cập nhật leader : null và số lượng trừ đi 1

  // Cuối cùng tạo new division
  createDivision: catchAsync(async (req, res, next) => {
    const leaderId = req.body.leader;
    const leader = await User.findById(leaderId).populate("position");

    if (leader) {
      if (leader?.position.role === "dm") {
        await Division.findByIdAndUpdate(
          leader.division,
          { $set: { leader: null }, $inc: { quantity: -1 } },
          { new: true, runValidators: true }
        );
      }
    }

    const data = await Division.create({
      ...req.body,
      quantity: leaderId ? 1 : 0,
      leader: leaderId,
    });

    res.status(200).json({
      status: "success",
      message: "Create success",
      data,
    });
  }),

  // Phần nãy cũng đau đầu
  // Đầu tiên tìm bộ phận mình muốn thay đổi
  // Nếu leader hiện tại khác leadr mới
  // Leader cũ sẽ phải cập nhật division thành null
  // leader mới cập nhật diviso thành division đang muốn cập nhật
  // Sau đó cập nhật division
  updateDivision: catchAsync(async (req, res, next) => {
    const oldDivision = await Division.findById(req.params.id);

    if (!oldDivision) {
      return next(new AppError("Document can't be found", 404));
    }

    if (oldDivision.leader !== req.body.leader) {
      const oldLeader = await User.findById(oldDivision.leader); // Thằng cũ
      const newLeader = await User.findById(req.body.leader); // Thằng mới

      if (!oldLeader || !newLeader) {
        return next(new AppError("User not found", 404));
      }

      await User.findByIdAndUpdate(
        oldDivision.leader,
        {
          $set: { division: null },
          $inc: { quantity: -1 },
        },
        { new: true, runValidators: true }
      );

      await User.findByIdAndUpdate(
        req.body.leader,
        {
          $set: { division: req.params.id },
        },
        { new: true, runValidators: true }
      );
    }

    const data = await Division.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "Update success",
      data,
    });
  }),

  // Xóa divsion thì cập nhật tất cả user thuộc division đó thành null
  deleteDivision: catchAsync(async (req, res, next) => {
    const { id: divisionId } = req.params;

    // Xóa division
    await Division.findByIdAndDelete(divisionId);

    // Chuyển tất cả các user có division bị xóa thành null
    await User.updateMany(
      { division: divisionId },
      { $set: { division: null } }
    );

    res.status(200).json({
      status: "success",
      message: "Delete successfully",
    });
  }),

  getDivision: catchAsync(async (req, res, next) => {
    const data = await Division.findById(req.params.id).populate({
      path: "leader",
      select: "name",
    });

    if (!data) {
      return next(new AppError("Document can't be found", 404));
    }

    res.status(200).json({
      status: "success",
      data,
    });
  }),

  getListDivision: catchAsync(async (req, res, next) => {
    const { search = "", page, limit } = req.query;
    // Xây dựng query filter
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    // Đếm tổng số bản ghi theo filter
    const total = await Division.countDocuments(query);
    // Khởi tạo truy vấn cơ bản
    let divisionQuery = Division.find(query)
      .sort({ createdAt: "desc" }) // Sắp xếp theo thời gian
      .populate({
        path: "leader",
        select: "name", // Lấy trường name từ leader
      });
    // Áp dụng phân trang nếu có `page` và `limit`
    if (page !== undefined && limit !== undefined) {
      const skip = Number(page) * Number(limit);
      const limitValue = Number(limit);
      divisionQuery = divisionQuery.skip(skip).limit(limitValue);
    }
    // Thực hiện truy vấn
    const data = await divisionQuery;
    // Trả kết quả
    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),
};

module.exports = divisionController;
