const divisionController = require("../controllers/divisionController");
const { isAuthenticatedUser, restrictTo } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser);
router.use(restrictTo("admin")); // Người dùng phải có quyền là admin

router
  .route("/")
  .get(divisionController.getListDivision) // Danh sách bộ phận
  .post(divisionController.createDivision); // Tạo bộ phận

router
  .route("/:id")
  .get(divisionController.getDivision) // Chi tiết bộ phân
  .patch(divisionController.updateDivision) // Cập nhật bộ phận
  .delete(divisionController.deleteDivision); // Xóa bộ phận

module.exports = router;
