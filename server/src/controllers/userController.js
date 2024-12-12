const User = require("../models/userModel");
const Division = require("../models/divisionModel");
const Position = require("../models/positionModel");
const AnnualLeave = require("../models/annualLeaveModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../middleware/catchAsync");
const AppError = require("./../utils/appError");
const mongoose = require("mongoose");
const TimeOff = require("../models/timeOffModel");
const PayCheck = require("../models/payCheckModel");
const CV = require("../models/cvModel");
const Event = require("../models/eventModel");

const filterObj = (obj, ...notAllowed) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (!notAllowed.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

const userController = {
  // Danh sách user
  getListUser: catchAsync(async (req, res, next) => {
    const { search = "", page, limit } = req.query;
    // Xây dựng query filter
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    // Đếm tổng số user theo query filter
    const total = await User.countDocuments(query);
    // Khởi tạo tìm kiếm cơ bản
    let userQuery = User.find(query)
      .sort({ createdAt: "desc" })
      .populate({ path: "division", select: "name" })
      .populate({ path: "position", select: "title role" });
    // Áp dụng phân trang nếu có page và limit
    if (page !== undefined && limit !== undefined) {
      const skip = Number(page) * Number(limit);
      const limitValue = Number(limit);
      userQuery = userQuery.skip(skip).limit(limitValue);
    }

    const data = await userQuery;
    // Trả kết quả
    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  // Danh sách user theo bộ phận
  // Tương tự trên nhưng thêm bộ lọc division: req.user?.division, (cái này là của DM)
  getListUserByDivision: catchAsync(async (req, res, next) => {
    let data = {};

    const total = await User.countDocuments({ division: req.user?.division });

    const search = req.query.search || ""; // Chuỗi cần tìm kiếm
    data = await User.find({
      name: { $regex: search, $options: "i" },
      division: req.user?.division,
    })
      .sort({ createdAt: "desc" })
      .skip(req.page)
      .limit(req.limit)
      .populate({
        path: "division",
        select: "name",
      })
      .populate({
        path: "position",
        select: "title role",
      });

    res.status(200).json({
      status: "success",
      total,
      data,
    });
  }),

  getListUserOfAnnualLeave: catchAsync(async (req, res, next) => {
    const usersWithAnnualLeave = await AnnualLeave.distinct("user");

    const data = await User.find({ _id: { $nin: usersWithAnnualLeave } });
    res.status(200).json({
      status: "success",
      data,
    });
  }),

  getUser: factory.getOneById(User),

  // Khi tạo user
  // Thì tìm bộ phận người đó đc tạo  (Ko có div thì tạo thôi mà mặc kệ logic ở dưới)
  // Nếu bộ phận đó chưa có leader : Người dùng có có role là DM thì cập nhật bộ phận đó với leader là người đang đc khởi tạo
  // Bộ phận đó có leader : Vẫn như trên nhưng thêm bước là tìm leader cũ của bộ phận rồi set division của người đó thành null
  // Cuối cùng là tạo user
  createUser: catchAsync(async (req, res, next) => {
    if (!req.body.division) {
      const data = await User.create(req.body); // tạo user
      return res.status(200).json({
        status: "success",
        message: "Create success",
        data,
      });
    }

    const division = await Division.findById(req.body.division); // Tìm bộ phận

    if (!division) {
      // Ko có bộ phận trả về lỗi
      return next(new AppError("Division can't be found", 404));
    }

    const dataDivisionUpdate = { quantity: (division.quantity || 0) + 1 }; // Tăng số lượng bộ phận lên 1

    const position = await Position.findById(req.body.position); // Tìm vị trí dựa theo id vị trí tạo của người dùng

    if (position.role == "dm" && division.leader) {
      // Trường hợp bộ phận có leader mà người đang khởi tạo cũng là leader
      await User.findByIdAndUpdate(
        division.leader,
        { $set: { division: null } },
        { new: true, runValidators: true }
      );
    }

    const data = await User.create(req.body); // tạo user

    if (position.role == "dm") dataDivisionUpdate.leader = data._id; // Nếu role của new user là DM  thì cập nhập lại leader của bộ phận

    await Division.findByIdAndUpdate(req.body.division, dataDivisionUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "Create success",
      data,
    });
  }),

  // Phần này khá là đau đầu
  // Cập nhât user (Ko có div thì cứ update bình thường)
  // Nếu đổi role mà ko đổi division và role ban đầu là DM thì division ấy phải đổi leader thành null

  // Nếu đổi division mà role là DM
  // Thì như trên division cũ có leader thành null
  // Division mới mà chưa có leadder thì cập nhật leader
  //  Dvision mới có có leader thì tìm leader cũ và biến division thành null
  updateUser: catchAsync(async (req, res, next) => {
    const oldUser = await User.findById(req.params.id);

    if (!req.body.division) {
      await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(200).json({
        status: "success",
        message: "Update success",
      });
    }

    if (!oldUser) {
      return next(new AppError("User can't be found", 404));
    }

    const position = await Position.findById(req.body.position);
    const division = await Division.findById(req.body.division);

    if (!position || !division) {
      return next(new AppError("Position or Division can't be found", 404));
    }

    const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!newUser) {
      return next(new AppError("User can't be found", 404));
    }

    // Kiểm tra xem vị trí và phòng ban có thay đổi không
    const positionChangedToLeader = position.role === "dm";
    const divisionChanged = String(division._id) !== String(oldUser.division);

    if (!positionChangedToLeader && !divisionChanged) {
      // Không có sự thay đổi vị trí và phòng ban
      res.status(200).json({
        status: "success",
        message: "Update success",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (divisionChanged) {
        // Tăng số lượng của phòng ban mới
        await Division.findByIdAndUpdate(
          division._id,
          { $inc: { quantity: 1 } },
          { new: true, runValidators: true, session }
        );

        // Giảm số lượng của phòng ban cũ
        await Division.findByIdAndUpdate(
          oldUser.division,
          { $inc: { quantity: -1 } },
          { new: true, runValidators: true, session }
        );
      }

      if (positionChangedToLeader) {
        // Cập nhật lãnh đạo phòng ban cũ thành null
        await User.findByIdAndUpdate(
          division.leader,
          { $set: { division: null } },
          { new: true, runValidators: true, session }
        );

        // Đặt lãnh đạo phòng ban mới thành người dùng hiện tại
        await Division.findByIdAndUpdate(
          division._id,
          { $set: { leader: oldUser._id } },
          { new: true, runValidators: true, session }
        );

        // Loại bỏ người dùng hiện tại khỏi vị trí lãnh đạo của phòng ban cũ
        await Division.findByIdAndUpdate(
          oldUser.division,
          { $set: { leader: null } },
          { new: true, runValidators: true, session }
        );
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        status: "success",
        message: "Update success",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(new AppError("Error updating user and division", 500));
    }
  }),

  // Phần này làm chắc cú hơn tạo 1 phiên giao dịch session (Kiểu ko có lỗi thì ok , lỗi thì nó roll back lại ban đầu)
  // Khi xóa user : thì  phòng  ban của user sẽ trừ 1
  // User đó mà là DM thì  phòng ban đó sẽ cập nhật leader thành null
  deleteUser: catchAsync(async (req, res, next) => {
    // Bắt đầu một phiên giao dịch
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Tìm người dùng và phòng ban của họ
      const user = await User.findById(req.params.id).session(session);
      if (!user) {
        return next(new AppError("User can't be found", 404));
      }

      const division = await Division.findById(user.division).session(session);

      if (user.type !== "outsite") {
        if (!division) {
          return next(new AppError("Division can't be found", 404));
        }

        // Giảm số lượng của phòng ban
        await Division.findByIdAndUpdate(
          division._id,
          { $inc: { quantity: -1 } },
          { new: true, session }
        );

        // Kiểm tra xem vị trí của người dùng có phải là DM không
        const position = await Position.findById(user.position).session(
          session
        );
        if (position && position.role === "dm") {
          // Đặt leader của phòng ban thành null
          await Division.findByIdAndUpdate(
            division._id,
            { $set: { leader: null } },
            { new: true, session }
          );
        }
      }

      // Xóa người dùng
      await User.findByIdAndDelete(req.params.id, { session });

      await AnnualLeave.deleteMany({ user: req.params.id }).session(session);

      await TimeOff.deleteMany({ userRequest: req.params.id }).session(session);

      await PayCheck.deleteMany({ user: req.params.id }).session(session);

      await CV.deleteMany({ user: req.params.id }).session(session);

      await Event.deleteMany({ host: req.params.id }).session(session);

      // Commit giao dịch
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        status: "success",
        message: "Delete success",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }),

  // Phần của profile
  updateMyProfile: catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm || req.body.role) {
      return next(
        new AppError(
          "This route is not allowed to be update password orrRole",
          404
        )
      );
    }
    const filterBody = filterObj(req.body, "role", "password");
    const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      data: user,
      status: "success",
      message: "Update success",
    });
  }),

  getMyProfile: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
      .populate({
        path: "division",
        select: "name",
      })
      .populate({
        path: "position",
        select: "title role",
      });
    res.status(200).json({
      status: "success",
      data: user,
    });
  }),
};

module.exports = userController;
