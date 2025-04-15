const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["operator", "admin","viewer"], default: "viewer" },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date },
});
module.exports = mongoose.model("User", userSchema);
