import express from "express";
const cors = require("cors");
import mongoose from "mongoose";
import IORedis from "ioredis";
import { Queue } from "bullmq";
import Assignment from "./models/Assignment";
import { initWorker } from "./workers/assignmentWorker";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// 1. Unified Redis Configuration
const redisOptions = { maxRetriesPerRequest: null };
const redisConnection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", redisOptions);

// 2. Initialize BullMQ Queue
const assignmentQueue = new Queue("assignment-generation", { connection: redisConnection });

// 3. Fire up the Background worker process
initWorker(redisConnection);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assessment-creator")
  .then(() => console.log("🍃 MongoDB Database Connected"))
  .catch(err => console.error("MongoDB Connection Failure:", err));

// Route A: Create Assignment endpoint
app.post("/api/assignments/create", async (req, res) => {
  try {
    const { title, dueDate, questionTypes, instructions } = req.body;

    const assignmentData = {
      title, // Stores whatever subject name you typed (e.g., "Physics")
      dueDate: new Date(dueDate),
      questionTypes,
      instructions,
      status: "pending"
    };
    
    const newAssignment = await (Assignment as any).create(assignmentData);

    // 🚨 CRITICAL: Pass 'title' into the queue data here!
    await assignmentQueue.add("generate-paper", {
      assignmentId: newAssignment._id,
      title: title, 
      instructions,
      questionTypes
    });

    return res.status(201).json({ success: true, assignmentId: newAssignment._id });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Route B: Single Document Check (Fixed try/catch structure)
app.get("/api/assignments/:id", async (req, res) => {
  try {
    const assignment = await (Assignment as any).findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    return res.json(assignment);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("🚀 Server up on http://localhost:5000"));