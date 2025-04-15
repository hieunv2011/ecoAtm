const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, restrictTo("admin"), taskController.createTask)
  .get(protect, restrictTo("admin"), taskController.getAllTasks);

router
  .route("/:id")
  .get(protect, restrictTo("admin"), taskController.getTaskById)
  .patch(protect, restrictTo("admin"), taskController.updateTask)
  .delete(protect, restrictTo("admin"), taskController.deleteTask);

module.exports = router;
