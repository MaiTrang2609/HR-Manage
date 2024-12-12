const RoomController = require("../controllers/roomController");
const { isAuthenticatedUser, restrictTo } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser);
// router.use(restrictTo("admin"));

router
  .route("/")
  .get(RoomController.getListRoom)
  .post(RoomController.createRoom);

router
  .route("/:id")
  .patch(RoomController.updateRoom)
  .delete(RoomController.deleteRoom)
  .get(RoomController.getRoom);

module.exports = router;
