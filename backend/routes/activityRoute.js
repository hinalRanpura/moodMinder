const express = require("express");
const { activityDetails, deleteActivity, allActivity, updateActivity, createActivity } = require("../controllers/activityController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/add/activity").post(isAuthenticatedUser,authorizeRoles("admin"),createActivity)
router.route("/view/activity/:id").get(isAuthenticatedUser,activityDetails)
router.route("/delete/activity/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteActivity)
router.route("/update/activity/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateActivity)
router.route("/all/activity").get(isAuthenticatedUser,allActivity)

module.exports = router;