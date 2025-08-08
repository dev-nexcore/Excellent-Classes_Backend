import express from 'express';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import {
  uploadImage,
  deleteImage,
  getImage,
  uploadVideo,
  deleteVideo,
  getVideo
} from '../controllers/adminMedia.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

// router.use(verifyAdmin);

// Images
router.post('/images',upload.single('image'), verifyAdmin,uploadImage);
router.delete('/images/:id',verifyAdmin, deleteImage);
router.get('/images',getImage);
// Videos
// router.post('/videos', uploadVideo);
router.post('/videos',  upload.single('video'), verifyAdmin,uploadVideo);
router.delete('/videos/:id',verifyAdmin, deleteVideo);
router.get('/videos',getVideo)

export default router;
