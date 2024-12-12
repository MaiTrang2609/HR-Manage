const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const { handleGetNickName } = require("../utils/removeAccents");

const userSchema = new mongoose.Schema(
  {
    name: {
      // Tên nhân viên
      type: String,
      required: [true, "Please tell us your name"],
    },
    nickName: String, // Nick name
    email: {
      type: String,
      required: [true, "Please tell us your email"],
      unique: true,
      lowcase: true,
    },
    phone: String,
    role: String,
    address: String,
    password: {
      type: String,
      // minLength: 8,
      select: false,
    },
    passwordChangedAt: Date, // Thời gian đổi mật khẩu

    position: {
      // Vị trí
      type: mongoose.Schema.ObjectId,
      ref: "Position",
    },
    division: {
      // Bộ phận
      type: mongoose.Schema.ObjectId,
      ref: "Division",
    },
    type: {
      // Ứng cử viên hoặc nhân viên chính thức
      type: String,
      enum: ["outsite", "staff"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ nickName: 1 }); // Nick name chỉ có 1

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12); // hash mật khẩu

  // this.passwordConfirm = undefined;
  // const nickName = handleGetNickName(this.name);
  // this.nickName = slugify(nickName, { lower: true });
});

userSchema.pre("save", function (next) {
  // Kiểm tra nếu thay đổi mật khẩu thì cập nhật thời gian thay đổi mật khẩu là hiện tại - 1s
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const data = this.getUpdate();
  if (data.password) data.password = await bcrypt.hash(data.password, 12); // hash mật khẩu
  next();
});

// Kiểm tra thời gian đổi mật khẩu và thời gian mã hóa ,
// mục tiêu nếu tk đăng nhập ở 2 nơi , thì nơi A đổi mk thì nơi B phải đăng nhập lại
userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Hàm so sánh mk đc lưu và mk người dùng truyền lên
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
