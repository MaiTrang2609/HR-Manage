const timeOffController = require("../controllers/timeOffController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser);

router.route("/user/:id").get(timeOffController.getListTimeOffUser);
router.route("/division/request").get(timeOffController.getListTimeOffRequest);

router
  .route("/")
  .get(timeOffController.getListTimeOff)
  .post(timeOffController.createTimeOff);
router
  .route("/:id")
  .get(timeOffController.getTimeOff)
  .patch(timeOffController.updateTimeOff)
  .delete(timeOffController.deleteTimeOff);

module.exports = router;
