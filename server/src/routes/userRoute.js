const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { isAuthenticatedUser, restrictTo } = require("../middleware/auth");
const router = require("express").Router();

router.post("/login", authController.login);
router.post("/login-google", authController.googleAuth);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);

router.post("/refresh", authController.requestRefreshToken);

router.use(isAuthenticatedUser);

router.route("/").get(userController.getListUser);

router.route("/:id").get(userController.getUser);

router.get("/auth/profile", userController.getMyProfile);
router.patch("/auth/updateMyProfile", userController.updateMyProfile);
router.patch("/auth/updateMyPassword", authController.updatePassword);

////////////////
router.get(
  "/division/:id",
  restrictTo("dm"),
  userController.getListUserByDivision
); // Lấy user theo division

////////////
router.get("/annual-leave", userController.getListUserOfAnnualLeave); // Lấy user chưa có lịch nghỉ để thêm lịch nghỉ

router.route("/").post(userController.createUser);

router
  .route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
