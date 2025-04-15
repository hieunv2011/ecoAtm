const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  camera_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Camera",
    required: true,
  },
  event_type: {
    type: String,
    required: true,
    enum: ["fight", "vandalism", "fall"],
  },
  event_time: {
    type: Date,
    required: true,
  },
  severity: {
    type: Number,
    default: 1,
  },
  confidence: {
    type: mongoose.Types.Decimal128,
    default: 0.0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
