const Email = require("../models/emailModel");
const factory = require("./handlerFactory");
const { configEmail } = require("../utils/sendEmail");

const emailController = {
  getListEmail: factory.getAll(Email, "title"),

  getEmail: factory.getOne(Email, "_id"),

  createEmail: factory.createOne(Email),

  updateEmail: factory.updateOne(Email),

  deleteEmail: factory.deleteOne(Email),

  // Tìm email dựa vào id
  // sau đó lấy được nội dung
  // Truyền nội dung và mảng gmail cần gửi cho hàm gửi email
  sendMail: async (req, res) => {
    try {
      let data = req.body;
      const email = await Email.findById(data.email);
      data = {
        to: data.to,
        text: email.desc,
      };
      await configEmail(data);
      res.status(201).json({
        status: "success",
        message: "Send mails ",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Register Failed! Please try again!",
      });
    }
  },
};

module.exports = emailController;
