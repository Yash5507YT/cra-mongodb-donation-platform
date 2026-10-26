const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, trim: true, maxlength: 160 },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    targetType: { type: String, trim: true, maxlength: 80 },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String, trim: true, maxlength: 600 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);

