const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  layout: {
    type: String,
    required: true,
  },
  threshold: {
    type: mongoose.Types.Decimal128,
    required: true,
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

module.exports = mongoose.model("Config", configSchema);
