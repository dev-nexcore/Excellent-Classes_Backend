// controllers/admin/noticeController.js

import Notice from "../models/Notice.js";
import Activity from "../models/Activity.js";
import Admin from "../models/Admin.js";

// Create a new notice
export const createNotice = async (req, res) => {
  const { description, date } = req.body;

  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // ✅ Format the date: "03 July 2025"
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const notice = await Notice.create({
      user: admin.email,
      description,
      date: formattedDate,
      action: "created",
    });

    await Activity.create({
      user: admin.email,
      action: "created",
      section: "notice",
      dateTime: new Date(),
    });

    res.status(201).json(notice);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create notice", error: err.message });
  }
};

// Get all notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    // Format the date for each notice
    const formattedNotices = notices.map((notice) => ({
      ...notice._doc,
      date: new Date(notice.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    }));

    res.status(200).json(formattedNotices);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch notices", error: err.message });
  }
};

// Update a notice
export const updateNotice = async (req, res) => {
  const { id } = req.params;
  const { user, description, date } = req.body;

  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const notice = await Notice.findByIdAndUpdate(
      id,
      {
        user,
        description,
        date: formattedDate,
        action: "updated",
      },
      { new: true }
    );

    if (!notice) return res.status(404).json({ message: "Notice not found" });

    await Activity.create({
      user: admin.email,
      action: "updated",
      section: "notice",
      dateTime: new Date(),
    });

    return res.status(200).json(notice);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update notice", error: err.message });
  }
};

// Delete a notice
export const deleteNotice = async (req, res) => {
  const { id } = req.params;

  try {
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    await Activity.create({
      user: notice.user,
      action: "deleted",
      section: "notice",
      dateTime: new Date(),
    });

    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete notice", error: err.message });
  }
};
