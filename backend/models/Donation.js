const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    amount: { type: Number, required: true, min: 1 },
    type: { type: String, enum: ["Money", "Books", "Clothes", "Supplies", "Other"], default: "Money" },
    quantity: { type: Number, min: 1 },
    note: { type: String, trim: true, maxlength: 500 },
    isAnonymous: { type: Boolean, default: false },
    status: { type: String, enum: ["Pending", "Accepted", "Delivered", "Rejected"], default: "Pending" },
    receiptNumber: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
