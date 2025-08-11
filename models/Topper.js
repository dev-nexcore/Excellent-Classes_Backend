import mongoose from "mongoose";
// import { type } from "os";

const topperSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    trade: { type: String, required: true },
    percentage: { type: Number, required: true },
    year: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null, //Add temperory default
    },
  },
  { timestamps: true }
);

export default mongoose.model("Topper", topperSchema);
