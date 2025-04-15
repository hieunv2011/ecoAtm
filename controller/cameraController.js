const Camera = require("../models/camera");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Get all cameras
exports.getCameras = catchAsync(async (req, res, next) => {
    let query = {};
  
    // Check if status is provided in query
    if (req.query.status) {
      const { status } = req.query;
  
      // Validate status value
      if (!["active", "inactive"].includes(status)) {
        return next(new AppError("Invalid status value", 400));
      }
  
      query.status = status;
    }
  
    // Fetch all cameras or cameras by status
    const cameras = await Camera.find(query);
  
    res.status(200).json({
      totalCameras: cameras.length,
      cameras,
    });
  });
  

// Get cameras by status (active or inactive)
exports.getCamerasByStatus = catchAsync(async (req, res, next) => {
  const { status } = req.query;

  // Kiểm tra giá trị status có hợp lệ không
  if (!["active", "inactive"].includes(status)) {
    return next(new AppError("Invalid status value", 400));
  }

  const cameras = await Camera.find({ status });

  res.status(200).json({
    totalCameras: cameras.length,
    cameras,
  });
});
// Get camera by ID
exports.getCameraById = catchAsync(async (req, res, next) => {
  const camera = await Camera.findById(req.params.id);

  if (!camera) {
    return next(new AppError("Camera not found", 404));
  }

  res.status(200).json(camera);
});
// Create a new camera
exports.createCamera = catchAsync(async (req, res, next) => {
  const {
    camera_name,
    latitude,
    longtitude,
    status,
    manager_name,
    manager_phone,
  } = req.body;

  const existingCamera = await Camera.findOne({ camera_name });

  if (existingCamera) {
    return next(new AppError("Camera name already exists", 400));
  }

  const newCamera = await Camera.create({
    camera_name,
    latitude,
    longtitude,
    status,
    manager_name,
    manager_phone,
  });

  res.status(201).json(newCamera);
});

// Update camera by ID
exports.updateCamera = catchAsync(async (req, res, next) => {
  const {
    camera_name,
    latitude,
    longtitude,
    status,
    manager_name,
    manager_phone,
  } = req.body;

  const updatedCamera = await Camera.findByIdAndUpdate(
    req.params.id,
    {
      camera_name,
      latitude,
      longtitude,
      status,
      manager_name,
      manager_phone,
      updateAt: Date.now(),
    },
    { new: true, runValidators: true }
  );

  if (!updatedCamera) {
    return next(new AppError("Camera not found", 404));
  }

  res.status(200).json(updatedCamera);
});

// Delete camera by ID
exports.deleteCamera = catchAsync(async (req, res, next) => {
  const camera = await Camera.findByIdAndDelete(req.params.id);

  if (!camera) {
    return next(new AppError("Camera not found", 404));
  }

  res.status(204).json({ message: "Camera deleted successfully" });
});
