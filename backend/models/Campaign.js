const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    summary: { type: String, required: true, trim: true, maxlength: 240 },
    story: { type: String, required: true, trim: true, maxlength: 3000 },
    category: { type: String, required: true, enum: ["Education", "Health", "Environment", "Community", "Emergency", "Other"] },
    targetAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0, min: 0 },
    donorCount: { type: Number, default: 0, min: 0 },
    coverImage: { type: String, trim: true, maxlength: 500 },
    location: { type: String, trim: true, maxlength: 120 },
    status: { type: String, enum: ["Draft", "Active", "Paused", "Completed"], default: "Draft" },
    endDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

campaignSchema.virtual("progressPercentage").get(function progressPercentage() {
  if (!this.targetAmount) return 0;
  return Math.min(100, Math.round((this.raisedAmount / this.targetAmount) * 100));
});

module.exports = mongoose.model("Campaign", campaignSchema);
