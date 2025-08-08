// controllers/admin/activityController.js

import Activity from '../models/Activity.js';

// Get recent activities
export const getRecentActivities = async (req, res) => {
  const { limit = 20, section } = req.query;

  try {
    const query = section ? { section } : {};
    const activities = await Activity.find(query)
      .sort({ dateTime: -1 })
      .limit(parseInt(limit));

    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch activities', error: err.message });
  }
};
