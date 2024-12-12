const CVController = require("../controllers/cVController");
const EmailController = require("../controllers/emailController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser); // Nếu chỉ có router.use thì toàn bộ các api dưới sẽ đều chạy qua hàm này (Người dùng phải đăng nhập)

router.route("/").get(CVController.getListCV).post(CVController.createCV); // Danh sách cv và tạo cv
router.route("/my-cv").get(CVController.getMyCV); // danh sách cv của người đang đăng nhập

router.route("/send-email").post(EmailController.sendMail); // Gửi email

router
  .route("/:id")
  .get(CVController.getCV) //  Chi tiết cv
  .patch(CVController.updateCV) // Cập nhật cv và xóa cv
  .delete(CVController.deleteCV); // xóa cv

module.exports = router;
