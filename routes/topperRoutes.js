import express from 'express';
import verifyAdmin from '../middlewares/verifyAdmin.js';
import {
  addTopper,
  getToppers,
  updateTopper,
  deleteTopper
} from '../controllers/adminTopper.js';

const router = express.Router();

// router.use(verifyAdmin);

// Images
router.post("/addTopper",verifyAdmin,addTopper);
router.get("/getTopper",getToppers);
router.put("/updateTopper/:id",verifyAdmin,updateTopper);
router.delete("/deleteTopper/:id",verifyAdmin,deleteTopper);
export default router;
