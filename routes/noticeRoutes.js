import express from 'express';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import {
  createNotice,
  getNotices,
  updateNotice,
  deleteNotice
} from '../controllers/adminNotice.js';

const router = express.Router();

// router.use(verifyAdmin);

router.post('/',verifyAdmin, createNotice);
router.get('/', getNotices);
router.put('/:id', verifyAdmin,updateNotice);
router.delete('/:id', verifyAdmin, deleteNotice);

export default router;
