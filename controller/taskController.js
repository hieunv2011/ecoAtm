const Task = require("../models/task");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/users");
// Get all tasks with filters
exports.getAllTasks = catchAsync(async (req, res, next) => {
  const { assignee, status, priority, start_date, due_date } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  let query = {};

  if (assignee) query.assignee = assignee;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (start_date) query.start_date = { $gte: new Date(start_date) };
  if (due_date) query.due_date = { $lte: new Date(due_date) };

  const tasks = await Task.find(query).skip(skip).limit(limit);
  const totalTasks = await Task.countDocuments(query);

  res.status(200).json({
    totalTasks,
    totalPages: Math.ceil(totalTasks / limit),
    currentPage: page,
    tasks,
  });
});

// Get task by ID
exports.getTaskById = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json(task);
});

// Create a new task
exports.createTask = catchAsync(async (req, res, next) => {
    const { task_name, description, assignee, status, priority, start_date, due_date } = req.body;
  
    // Check if assignee (user_id) exists
    if (assignee) {
      const userExists = await User.findById(assignee);
      if (!userExists) {
        return next(new AppError("Assignee (User) not found", 404));
      }
    }
  
    const newTask = await Task.create({
      task_name,
      description,
      assignee,
      status,
      priority,
      start_date,
      due_date,
    });
  
    res.status(201).json(newTask);
  });
  
// Update task
exports.updateTask = catchAsync(async (req, res, next) => {
  const { task_name, description, assignee, status, priority, start_date, due_date } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { task_name, description, assignee, status, priority, start_date, due_date, updated_at: Date.now() },
    { new: true, runValidators: true }
  );

  if (!updatedTask) {
    return next(new AppError("Task not found", 404));
  }

  res.status(200).json(updatedTask);
});

// Delete task
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError("Task not found", 404));
  }

  res.status(204).json({ message: "Task deleted successfully" });
});
