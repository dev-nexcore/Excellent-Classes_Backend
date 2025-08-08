import express from 'express';
import {
  loginOrSignup,
  resetPassword,
  logout,
  sendOtp,
  verifyOtp,
  getAdminDetails
} from '../controllers/adminAuth.js';
import verifyAdmin from '../middlewares/verifyAdmin.js';

const router = express.Router();

router.post('/login', loginOrSignup);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/me',verifyAdmin, getAdminDetails);

export default router;
