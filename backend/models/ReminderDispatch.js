const mongoose = require("mongoose");

const reminderDispatchSchema = new mongoose.Schema(
  {
    dispatchKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    renewalDate: {
      type: Date,
      required: true,
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["processing", "sent", "failed"],
      default: "processing",
      index: true,
    },
    attemptCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastError: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

reminderDispatchSchema.index({ status: 1, updatedAt: 1 });

module.exports =
  mongoose.models.ReminderDispatch ||
  mongoose.model("ReminderDispatch", reminderDispatchSchema);

