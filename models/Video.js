import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);