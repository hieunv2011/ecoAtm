require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controller/errorController");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const logRoutes = require("./routes/logRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cameraRoutes = require("./routes/cameraRoutes");
const eventRoutes = require("./routes/eventRoutes");
const configRoutes = require("./routes/configRoutes");

const swaggerDocs = require("./utils/swagger");

const app = express();
app.use(express.json());
connectDB();

const PORT = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/logs", logRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/cameras", cameraRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/config", configRoutes);

swaggerDocs(app);
app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
