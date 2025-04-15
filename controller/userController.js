const User = require("../models/users");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// Create a user (Admin only)
exports.createUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("You do not have permission to create a user", 403));
  }

  const { username, email, password, phone, role } = req.body;
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    return next(new AppError("Username or email already exists", 400));
  }

  const newUser = await User.create({ username, email, password, phone, role });
  res.status(201).json(newUser);
});

// Get all users (Admin only) with pagination
exports.getAllUsers = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("You do not have permission to view the user list", 403));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = 50;
  const skip = (page - 1) * limit;
  const filter = req.query.role ? { role: req.query.role } : {};

  const users = await User.find(filter).skip(skip).limit(limit);
  const totalUsers = await User.countDocuments(filter);

  res.status(200).json({
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
    users,
  });
});

// Get personal information or another user's info (Admin or the user themselves)
exports.getUserById = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
    return next(new AppError("You do not have permission to access this user's information", 403));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json(user);
});

// Update personal information or another user's info (Admin or the user themselves)
exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
    return next(new AppError("You can only update your own information", 403));
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json(updatedUser);
});

// Delete a user (Admin only)
exports.deleteUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("You do not have permission to delete a user", 403));
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(204).send();
});

// Delete multiple users (Admin only)
exports.deleteManyUsers = catchAsync(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("You do not have permission to delete multiple users", 403));
  }

  const { ids } = req.body;
  if (!ids || !ids.length) {
    return next(new AppError("A list of IDs must be provided for deletion", 400));
  }

  await User.deleteMany({ _id: { $in: ids } });
  res.status(204).send();
});
