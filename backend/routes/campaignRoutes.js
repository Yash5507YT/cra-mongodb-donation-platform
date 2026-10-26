const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/campaignController");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

const router = express.Router();
const campaignRules = [body("title").trim().isLength({ min: 4, max: 120 }), body("summary").trim().isLength({ min: 12, max: 240 }), body("story").trim().isLength({ min: 30, max: 3000 }), body("category").isIn(["Education", "Health", "Environment", "Community", "Emergency", "Other"]), body("targetAmount").isFloat({ min: 1 })];

router.get("/", controller.listCampaigns);
router.get("/mine", protect, allowRoles("ngo", "admin"), controller.myCampaigns);
router.get("/:id", controller.getCampaign);
router.post("/", protect, allowRoles("ngo", "admin"), campaignRules, controller.createCampaign);
router.put("/:id", protect, allowRoles("ngo", "admin"), controller.updateCampaign);

module.exports = router;
