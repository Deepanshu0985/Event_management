import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // if using ESM

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// --- Sample Schema & Model ---
const UserSchema = new mongoose.Schema({
  Name: String,
});

const User = mongoose.model("user", UserSchema);

const UserEventSchema = new mongoose.Schema({
  userIds: [String],
  EventStartDate: Date,
  EventEndDate: Date,
  EventTimezone: String,
});

const Event = mongoose.model("Event", UserEventSchema);

// --- CRUD ROUTES ---

// Create
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User({ Name: req.body.Name });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const { userIds, startDate, startTime, endDate, endTime, timezone } =
      req.body;

    const start = dayjs.tz(`${startDate} ${startTime}`, timezone).toDate();
    const end = dayjs.tz(`${endDate} ${endTime}`, timezone).toDate();

    const event = new Event({
      userIds,
      EventStartDate: start,
      EventEndDate: end,
      EventTimezone: timezone,
    });

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// GET all events with user info
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().populate("userIds", "Name");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id); // <-- find by MongoDB _id
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/events/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await Event.find({ userIds: userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
app.put("/api/users/:id", async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Server ---
app.listen(5001, () => console.log("Server running on port 5001"));
