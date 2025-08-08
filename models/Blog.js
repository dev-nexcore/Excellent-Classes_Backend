import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  content: { type: String, required: true },
  date: { type: String, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);