// controllers/admin/noticeController.js

import News from '../models/News.js';
import Activity from '../models/Activity.js';
import Admin from '../models/Admin.js';

// Create a new notice
export const createNews = async (req, res) => {
  const { description, date } = req.body;

  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // ✅ Format the date: "03 July 2025"
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const news = await News.create({
      user: admin.email,
      description,
      date: formattedDate,
      action: 'created'
    });


    await Activity.create({
      user: admin.email,
      action: 'created',
      section: 'news',
      dateTime: new Date(),
    });

    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create news', error: err.message });
  }
};

// Get all notices
export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });

    // Format the date for each notice
    const formattedNews = news.map(item => ({
      ...item._doc,
      date: new Date(item.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }));

    res.status(200).json(formattedNews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch news', error: err.message });
  }
};

// Update a notice
export const updateNews = async (req, res) => {
  const { id } = req.params;
  const { description, date } = req.body;

  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const news = await News.findByIdAndUpdate(
      id,
      {
        user: admin.email,
        description,
        date: formattedDate,
        action: 'updated'
      },
      { new: true }
    );

    if (!news) return res.status(404).json({ message: 'News not found' });

    await Activity.create({
      user: admin.email,
      action: 'updated',
      section: 'news',
      dateTime: new Date(),
    });

    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update news', error: err.message });
  }
};

// Delete a notice
export const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findByIdAndDelete(id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    await Activity.create({
      user: news.user,
      action: 'deleted',
      section: 'news',
      dateTime: new Date(),
    });

    res.status(200).json({ message: 'News deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete news', error: err.message });
  }
};
