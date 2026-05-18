import multer from 'multer';

// Use memory storage so we don't save anything to the local disk.
// The file buffer is forwarded straight to Cloudinary.
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only JPEG, PNG, GIF, and WEBP images are allowed.'));
    }
  },
});
