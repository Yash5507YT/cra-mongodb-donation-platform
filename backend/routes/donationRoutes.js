const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/donationController");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

const router = express.Router();

router.post("/", protect, allowRoles("donor"), [body("campaignId").isMongoId(), body("amount").isFloat({ min: 1 }), body("type").optional().isIn(["Money", "Books", "Clothes", "Supplies", "Other"])], controller.createDonation);
router.get("/mine", protect, allowRoles("donor"), controller.getMyDonations);
router.get("/campaign/:campaignId", protect, allowRoles("ngo", "admin"), controller.getCampaignDonations);
router.put("/:id/status", protect, allowRoles("ngo", "admin"), [body("status").isIn(["Pending", "Accepted", "Delivered", "Rejected"])], controller.updateDonationStatus);

module.exports = router;
