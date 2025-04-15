const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Tên người dùng hoặc mật khẩu không đúng", 401));
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Đăng nhập thành công",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

const register = catchAsync(async (req, res, next) => {
  const { username, email, password, phone, role } = req.body;

  // Kiểm tra xem username hoặc email đã tồn tại chưa
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return next(new AppError("Tên người dùng hoặc email đã tồn tại", 400));
  }

  // Mã hóa mật khẩu trước khi lưu vào database
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({ username, email, password: hashedPassword, phone, role });
  await newUser.save();

  res.status(201).json({
    message: "Đăng ký thành công",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
  });
});

module.exports = { login, register };
