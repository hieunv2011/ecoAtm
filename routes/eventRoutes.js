const express = require("express");
const router = express.Router();
const eventController = require("../controller/eventController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(
    // protect, restrictTo("admin"),
    eventController.getEvents
  )
  .post(
    // protect, restrictTo("admin"),
    eventController.createEvent
  );

router.route("/:id").get(
  // protect, restrictTo("admin"),
  eventController.getEventById
);

module.exports = router;
