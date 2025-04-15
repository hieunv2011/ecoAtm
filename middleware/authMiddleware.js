const jwt = require("jsonwebtoken");
const User = require("../models/users");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  console.log(req.headers);
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("Bạn chưa đăng nhập", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("Người dùng không tồn tại", 401));
  }

  req.user = user;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Bạn không có quyền thực hiện hành động này", 403));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
