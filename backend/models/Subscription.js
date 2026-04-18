const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    serviceName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    renewalDate: {
      type: Date,
      required: true,
      index: true,
    },
    remindBeforeDays: {
      type: Number,
      default: 3,
      min: 0,
      max: 30,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
      trim: true,
      uppercase: true,
      maxlength: 10,
    },
    billingCycle: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "yearly"],
      default: "monthly",
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
      index: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastNotifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.pre("validate", function syncServiceName(next) {
  const normalizedName = (this.serviceName || this.name || "").trim();

  if (normalizedName) {
    this.serviceName = normalizedName;
    this.name = normalizedName;
  }

  next();
});

subscriptionSchema.index({ userId: 1, status: 1, renewalDate: 1 });
subscriptionSchema.index({ status: 1, reminderSent: 1, renewalDate: 1 });

module.exports =
  mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
