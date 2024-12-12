const payCheckController = require("../controllers/payCheckController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = require("express").Router();

router.use(isAuthenticatedUser);

router.route("/my-seft").get(payCheckController.getMyPayCheck);
router
  .route("/")
  .get(payCheckController.getListPayCheck)
  .post(payCheckController.createPayCheck);

router
  .route("/:id")
  .get(payCheckController.getPayCheck)
  .patch(payCheckController.updatePayCheck)
  .delete(payCheckController.deletePayCheck);

module.exports = router;
