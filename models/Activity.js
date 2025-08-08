import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true }, // e.g., 'added', 'deleted'
  section: { type: String, enum: ['blog', 'notice', 'image', 'video', 'topper','news'], required: true },
  dateTime: { type: Date, default: Date.now }
});

export default mongoose.model("Activity", activitySchema);