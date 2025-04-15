const express = require("express");
const router = express.Router();
const logController = require("../controller/logController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(
    // protect, restrictTo("admin"),
    logController.createLog
  )
  .get(
    // protect, restrictTo("admin"),
    logController.getAllLogs
  );
router.get("/:id", logController.getAllLogs);
module.exports = router;
