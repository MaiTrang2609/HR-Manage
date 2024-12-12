const EventController = require("../controllers/eventController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser);

router.route("/my-event").get(EventController.getMyEvent); // Sự kiện của người đang đăng nhập

router
  .route("/")
  .get(EventController.getListEvent) // Danh sách event
  .post(EventController.createEvent); // Tạo event

router
  .route("/:id")
  .patch(EventController.updateEvent) // Cập nhật event
  .delete(EventController.deleteEvent) // Xóa event
  .get(EventController.getEvent); // Chi tiết event

module.exports = router;
