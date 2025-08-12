// controllers/admin/authController.js

import Admin from '../models/Admin.js';
import OTP from '../models/Otp.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/sendEmail.js'

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET; // put in .env

// Admin login/signup (combined)
export const loginOrSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });
    } else {
      const hashed = await bcrypt.hash(password, 10);
      admin = await Admin.create({ email, password: hashed });
    }

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, admin });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get admin details using token
export const getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password'); // exclude password

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ admin });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin details', error: err.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Admin not found with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 10 mins

    await OTP.deleteMany({ email }); // clean old OTPs
    await OTP.create({ email, otp, expiresAt });

    await sendOtpEmail(email, otp); // send real email

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// Verify OTP before allowing password reset
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (record.expiresAt < Date.now()) {
      await OTP.deleteMany({ email }); // Clean up expired OTPs
      return res.status(400).json({ message: 'OTP has expired' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};


// Reset password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and newPassword are required' });
    }

    const record = await OTP.findOne({ email, otp });
    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await Admin.updateOne({ email }, { password: hashed });
    await OTP.deleteMany({ email }); // Clean up OTPs

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Could not reset password', error: err.message });
  }
};


// Logout controller (stateless)
export const logout = async (req, res) => {
  try {
    // Optionally, you can log token usage or add it to a blacklist (see Option 2)
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};
