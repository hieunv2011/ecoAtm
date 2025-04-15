const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
  camera_name: { type: String, require: true, unique: true },
  latitude: { type: String },
  longtitude: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  manager_name: { type: String },
  manager_phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date },
});
module.exports = mongoose.model("Camera", cameraSchema);
