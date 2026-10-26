const express = require("express");
const controller = require("../controllers/adminController");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

const router = express.Router();
router.use(protect, allowRoles("admin"));
router.get("/dashboard", controller.dashboard);
router.get("/users", controller.listUsers);
router.get("/ngos", controller.listNGOs);
router.get("/donations", controller.listDonations);
router.put("/users/:id", controller.updateUser);
router.get("/activity", controller.recentActivity);

module.exports = router;
