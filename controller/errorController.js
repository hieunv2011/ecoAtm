const AppError = require("../utils/AppError");

require("dotenv").config();

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;
  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};
const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;
  if (error.isOperational) {
    res.status(statusCode).json({
      status,
      message,
      stack,
    });
  }
  console.log(error.name, error.message, stack);
  return res.status(500).json({
    status: "error",
    message: "Something is wrong",
  });
};
const globalErrorHandler = (err, req, res, next) => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }
  return sendErrorProd(err, res);
};
module.exports = globalErrorHandler;
