const express = require('express');
const router = express.Router();
const cameraController = require('../controller/cameraController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Route to get all cameras or cameras by status
router
  .route('/')
  .get(protect, restrictTo('admin'), cameraController.getCameras)  // Combined route for both
  .post(protect, restrictTo('admin'), cameraController.createCamera);

// Route to get camera by ID
router
  .route('/:id')
  .get(protect, restrictTo('admin'), cameraController.getCameraById)
  .patch(protect, restrictTo('admin'), cameraController.updateCamera)
  .delete(protect, restrictTo('admin'), cameraController.deleteCamera);

module.exports = router;
