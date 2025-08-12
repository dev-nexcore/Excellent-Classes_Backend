import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/adminRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import topperRoutes from "./routes/topperRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
// import newsRoutes from "./routes/newsRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001","https://www.excellent-classes.nexcorealliance.com", "https://excellent-admin.code4bharat.com", "https://www.excellent-admin.code4bharat.com"],
    credentials: true,
  })
);

app.use(express.json());

// Database connection
connectDB();

app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/notices", noticeRoutes);
app.use("/api/admin/blogs", blogRoutes);
app.use("/api/admin/media", mediaRoutes);
app.use("/api/admin/toppers", topperRoutes);
app.use("/api/admin/activities", activityRoutes);
// app.use("/api/admin/news", newsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));