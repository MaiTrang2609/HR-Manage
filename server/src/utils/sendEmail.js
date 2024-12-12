const nodemailer = require("nodemailer");
const { decode } = require("html-entities");

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

// Phần config để gửi emial

const configEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    // Tạo port để gửi emial
    service: "gmail",
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  });

  const decodedHtml = decode(data.text); // decode cho thẻ html

  const options = {
    from: adminEmail, //
    to: data.to, // danh sách các email đc gửi
    subject: "HR Manage", // Tiêu đề email
    html: decodedHtml, // Nội dung email
  };

  await transporter.sendMail(options); // Gửi email
};

module.exports = { configEmail };
