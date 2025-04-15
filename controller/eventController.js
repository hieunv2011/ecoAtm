const Event = require("../models/event");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Camera = require("../models/camera");

// Get all events
exports.getAllEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find();
  res.status(200).json({ totalEvents: events.length, events });
});

// Get events by event_type or camera_id
exports.getEvents = catchAsync(async (req, res, next) => {
    const { event_type, camera_id } = req.query;
    let filter = {};
  
    if (event_type) filter.event_type = event_type;
    if (camera_id) filter.camera_id = camera_id;
  
    const events = await Event.find(filter);
  
    res.status(200).json({
      totalEvents: events.length,
      events,
    });
  });
  

// Get event by ID
exports.getEventById = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) return next(new AppError("Event not found", 404));

  res.status(200).json(event);
});

exports.createEvent = catchAsync(async (req, res, next) => {
  const { camera_id, event_type, event_time, severity, confidence } = req.body;

  // Check if all required fields are provided
  if (!camera_id || !event_type || !event_time) {
    return next(new AppError("Missing required fields", 400));
  }

  // Validate event_type
  const validEventTypes = ["fight", "vandalism", "fall"];
  if (!validEventTypes.includes(event_type)) {
    return next(new AppError("Invalid event_type", 400));
  }

  // Check if the camera exists
  const cameraExists = await Camera.findById(camera_id);
  if (!cameraExists) {
    return next(new AppError("Camera not found", 404));
  }

  // Create event
  const newEvent = await Event.create({
    camera_id,
    event_type,
    event_time,
    severity,
    confidence,
  });

  res.status(201).json(newEvent);
});
