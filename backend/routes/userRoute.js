const express = require("express");
const { registerUser, loginUser, logout, forgotPassword, updatePassword, resetPassword, getUserDetails, getAllUsers, upadateUserRole, deleteUser, viewUserDatail, giveFeedback, viewFeedback, updateUserProfile } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me").get(isAuthenticatedUser,getUserDetails)
router.route("/update/profile").put(isAuthenticatedUser,updateUserProfile)      
router.route("/getusers").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
router.route("/updaterole/:id").put(isAuthenticatedUser,authorizeRoles("admin"),upadateUserRole)
router.route("/delete/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)
router.route("/view/:id").get(isAuthenticatedUser,authorizeRoles("admin"),viewUserDatail)
router.route("/add/feedback").post(isAuthenticatedUser,giveFeedback)
router.route("/feedback").get(isAuthenticatedUser,authorizeRoles("admin"),viewFeedback)

module.exports = router;