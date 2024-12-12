const EmailController = require("../controllers/emailController");
const { isAuthenticatedUser, restrictTo } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser); // Kiểm tra người dùng đã đăng nhập chưa
router.use(restrictTo("hr", "admin")); // Người dùng phải có quyền là hr, admin

router.route("/send-email").post(EmailController.sendMail); // Gủi đi email

router
  .route("/")
  .get(EmailController.getListEmail) // Danh sách email
  .post(EmailController.createEmail); // tại email

router
  .route("/:id")
  .patch(EmailController.updateEmail) // Cập nhật email
  .delete(EmailController.deleteEmail) // Xóa email
  .get(EmailController.getEmail); // Chi tiết email

module.exports = router;
