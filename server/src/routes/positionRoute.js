const PositionController = require("../controllers/positionController");
const { isAuthenticatedUser, restrictTo } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser);
router.use(restrictTo("admin"));

router
  .route("/")
  .get(PositionController.getListPosition)
  .post(PositionController.createPosition);

router
  .route("/:id")
  .get(PositionController.getPosition)
  .patch(PositionController.updatePosition)
  .delete(PositionController.deletePosition);

module.exports = router;
