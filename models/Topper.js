import mongoose from "mongoose";

const topperSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  trade: { type: String, required: true },
  percentage: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

export default mongoose.model("Topper", topperSchema);