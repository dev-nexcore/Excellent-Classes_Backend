// controllers/admin/mediaController.js

import Image from '../models/Image.js';
import Video from '../models/Video.js';
import Activity from '../models/Activity.js';
import Admin from '../models/Admin.js';



export const uploadImage = async (req, res) => {
  try {
    const adminId = await Admin.findById(req.adminId);
    if (!adminId) return res.status(404).json({ message: 'Admin not found' });

    // ✅ Now req.file has the uploaded file
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // ✅ Build the real URL
    const imageUrl = req.file.path; // This is the Cloudinary URL


    // ✅ Save it in DB
    const image = await Image.create({ imageUrl, uploadedBy: adminId });

    await Activity.create({
      user: adminId.email,
      action: 'uploaded',
      section: 'image',
      dateTime: new Date(),
    });

    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload image', error: err.message });
  }
};


// Delete an image
export const deleteImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Image.findByIdAndDelete(id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    const adminId = await Admin.findById(req.adminId);
    if (!adminId) return res.status(404).json({ message: 'Admin not found' });

    await Activity.create({
      user: admin.email,
      action: 'deleted',
      section: 'image',
      dateTime: new Date(),
    });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete image', error: err.message });
  }
};
//get images
export const getImage = async (req, res) => {
  try {
    const images= await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to get images" });
  }
};
export const getVideo=async(req,res)=>{
  try{
    const videos=await Video.find();
    res.status(200).json(videos);
  }
  catch(err){
    res.status(500).json({message:"failed to fetch the videos",error:err.message})
  }
}
// Upload a video
export const uploadVideo = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const admin = await Admin.findById(req.adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // ✅ Yeh dekho - sirf URL save karo
    const videoUrl = file.path;

    console.log("videoUrl:", videoUrl); // ✅ String hona chahiye

    const video = await Video.create({
      videoUrl,                // ✅ Sirf string
      uploadedBy: admin._id,
    });

    await Activity.create({
      user: admin.email,
      action: 'uploaded',
      section: 'video',
      dateTime: new Date(),
    });

    res.status(201).json(video);
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Failed to upload video', error: err.message });
  }
};


// export const uploadVideo = async (req, res) => {
//   try {
//     const file = req.path;
   

//     if (!file) {
//       return res.status(400).json({ message: 'No video file uploaded' });
//     }

//     // Get adminId from middleware (you mentioned it's available in req.adminId)
//     const admin = await Admin.findById(req.adminId);

//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }
//      console.log("file",file);
//     console.log("admin",admin)

//     // Save the relative path (served at /uploads/...)
//     const videoUrl = req.file; 
//     console.log("FILE:", req.file);
// console.log("ADMIN ID:", req.adminId);
// // ✅ Cloudinary URL


//     const video = await Video.create({
//       videoUrl,
//       uploadedBy: admin._id, // or admin.name/email if you prefer
//     });

//     await Activity.create({
//       user: 'admin',
//       action: 'uploaded',
//       section: 'video',
//       dateTime: new Date(),
//     });

//     res.status(201).json(video);
//   } catch (err) {
//     console.error('Upload Error:', err);
//     res.status(500).json({ message: 'Failed to upload video', error: err.message });
//   }
// };
// controllers/mediaController.js


// export const uploadVideo = async (req, res) => {
//   try {
//     // ✅ Check uploaded file
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ message: 'No video file uploaded' });
//     }

//     // ✅ Make sure your JWT middleware sets req.adminId
//     if (!req.adminId) {
//       return res.status(401).json({ message: 'Unauthorized: Missing admin ID' });
//     }

//     // ✅ Verify admin exists
//     const admin = await Admin.findById(req.adminId);
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }

//     // ✅ When using CloudinaryStorage, file.path === Cloudinary secure_url
//     console.log("Cloudinary file info:", file);

//     const videoUrl = file.path;

//     // ✅ Create video doc
//     const video = await Video.create({
//       videoUrl,
//       uploadedBy: admin._id,
//     });

//     // ✅ Log activity
//     await Activity.create({
//       user: admin._id,
//       action: 'uploaded',
//       section: 'video',
//       dateTime: new Date(),
//     });

//     res.status(201).json(video);
//   } catch (err) {
//     console.error('Upload Error:', err);
//     res.status(500).json({
//       message: 'Failed to upload video',
//       error: err.message,
//     });
//   }
// };


// Delete a video
export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findByIdAndDelete(id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    const admin = await Admin.findById(req.adminId)

    await Activity.create({
      user: admin.email,
      action: 'deleted',
      section: 'video',
      dateTime: new Date(),
    });

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete video', error: err.message });
  }
};
