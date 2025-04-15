const Log = require("../models/logs");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/users");
const AppError = require("../utils/AppError");

// Create a log (Admin or user themselves)
exports.createLog = catchAsync(async (req, res, next) => {
  const { user_id, action } = req.body;
  if (user_id) {
    const userExists = await User.findById(user_id);
    if (!userExists) {
      return next(new AppError("User not found", 404));
    }
  }

  const newLog = await Log.create({
    user_id: user_id || req.user._id,
    action,
  });

  res.status(201).json(newLog);
});

// Get all logs (Admin only)
exports.getAllLogs = catchAsync(async (req, res, next) => {
  //   if (req.user.role !== "admin") {
  //     return next(new AppError("You do not have permission to view the log list", 403));
  //   }
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  const query = id ? { user_id: id } : {}; 

  const logs = await Log.find(query).skip(skip).limit(limit);
  const totalLogs = await Log.countDocuments(query);

  res.status(200).json({
    totalLogs,
    totalPages: Math.ceil(totalLogs / limit),
    currentPage: page,
    logs,
  });
});
