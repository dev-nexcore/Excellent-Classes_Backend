import Blog from "../models/Blog.js";
import Activity from "../models/Activity.js";
import Admin from "../models/Admin.js";

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get blogs" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, date } = req.body;
    const image = req.file ? req.file.path : ''; // Cloudinary URL

    const newBlog = new Blog({
      title,
      content,
      image,
      date,
      createdBy: req.adminId,
    });

    await newBlog.save();

    const admin = await Admin.findById(req.adminId);
    await Activity.create({
      user: admin.email,
      action: 'created',
      section: 'blog',
      dateTime: new Date(),
    });

    res.status(201).json(newBlog);
  } catch (err) {
    console.error('Error adding blog:', err);
    res.status(500).json({ error: 'Failed to add blog' });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const allowedUpdates = ['title', 'content', 'image', 'date'];
    const updateData = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.file) {
      updateData.image = req.file.path; // Cloudinary URL
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });

    const admin = await Admin.findById(req.adminId);
    await Activity.create({
      user: admin.email,
      action: 'updated',
      section: 'blog',
      dateTime: new Date(),
    });

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    await Activity.create({
      user: admin.email,
      action: 'deleted',
      section: 'blog',
      dateTime: new Date(),
    });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
};


export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};
