const annualLeaveController = require("../controllers/annualLeaveController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser);

router.route("/user/:id").get(annualLeaveController.getAnnualLeaveOfUser);

router
  .route("/")
  .get(annualLeaveController.getListAnnualLeave)
  .post(annualLeaveController.createAnnualLeave);

router
  .route("/:id")
  .get(annualLeaveController.getAnnualLeave)
  .patch(annualLeaveController.updateAnnualLeave)
  .delete(annualLeaveController.deleteAnnualLeave);

module.exports = router;
