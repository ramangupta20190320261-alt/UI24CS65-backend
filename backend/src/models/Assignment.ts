import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [String], default: [] },
    instructions: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "failed"],
      default: "pending",
    },
    generatedPaper: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);