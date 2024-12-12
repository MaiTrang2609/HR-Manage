const jobController = require("../controllers/jobController");
const { isAuthenticatedUser, restrictTo } = require("../middleware/auth");
const router = require("express").Router();

// Tương tự danh sách, chi tiết , tạo , cập nhật và xóa job
router.use(isAuthenticatedUser);
// router.use(restrictTo("hr", "admin")); // Người dùng phải có quyền là hr, admin

router.route("/").get(jobController.getListJob).post(jobController.createJob);

router
  .route("/:id")
  .get(jobController.getJob)
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);

module.exports = router;
