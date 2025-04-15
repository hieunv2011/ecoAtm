const express = require("express");
const router = express.Router();
const configController = require("../controller/configController");
// const { protect, restrictTo } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(
    // protect, restrictTo("admin"),
    configController.getAllConfigs
  )
  .post(
    // protect, restrictTo("admin"),
    configController.createConfig
  );

router
  .route("/:id")
  .get(
    // protect, restrictTo("admin"),
    configController.getConfigById
  )
  .patch(
    // protect, restrictTo("admin"),
    configController.updateConfig
  )
  .delete(
    // protect, restrictTo("admin"),
    configController.deleteConfig
  );

module.exports = router;
