import multer from "multer";
import path from "path";

// Save files to ./uploads folder temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // make sure ./uploads folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export const uploadProfileImage = upload.single("profileImage");
export const uploadCoverImage = upload.single("coverImage");

export default upload;
