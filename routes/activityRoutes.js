import express from 'express';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import { getRecentActivities } from '../controllers/adminActivity.js';

const router = express.Router();

router.use(verifyAdmin);

router.get('/', getRecentActivities);

export default router;
