const Config = require("../models/config");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Get all configs
exports.getAllConfigs = catchAsync(async (req, res, next) => {
  const configs = await Config.find();
  res.status(200).json({ totalConfigs: configs.length, configs });
});

// Get config by ID
exports.getConfigById = catchAsync(async (req, res, next) => {
  const config = await Config.findById(req.params.id);
  if (!config) return next(new AppError("Config not found", 404));

  res.status(200).json(config);
});

// Create a new config
exports.createConfig = catchAsync(async (req, res, next) => {
  const { layout, threshold } = req.body;

  if (!layout || !threshold) {
    return next(new AppError("Missing required fields", 400));
  }

  const newConfig = await Config.create({ layout, threshold });

  res.status(201).json(newConfig);
});

// Update config by ID
exports.updateConfig = catchAsync(async (req, res, next) => {
  const updatedConfig = await Config.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedConfig) return next(new AppError("Config not found", 404));

  res.status(200).json(updatedConfig);
});

// Delete config by ID
exports.deleteConfig = catchAsync(async (req, res, next) => {
  const deletedConfig = await Config.findByIdAndDelete(req.params.id);

  if (!deletedConfig) return next(new AppError("Config not found", 404));

  res.status(204).send();
});
