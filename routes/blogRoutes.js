import express from 'express';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  getBlogById
} from '../controllers/adminBlog.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// router.use(verifyAdmin);


router.post('/', verifyAdmin, upload.single('image'), createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.put('/:id', verifyAdmin, upload.single('image'), updateBlog);
router.delete('/:id', verifyAdmin, deleteBlog);

export default router;
