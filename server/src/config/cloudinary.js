import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload local file to Cloudinary and remove local copy
export const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "user_uploads",
    });

    // Remove local file after upload
    await fs.unlink(localFilePath);

    return result.secure_url; // return the Cloudinary URL
  } catch (err) {
    console.error("Cloudinary upload error:", err);

    // Try removing the local file if it still exists
    try {
      await fs.unlink(localFilePath);
    } catch (e) {
      console.error("Failed to remove local file:", e);
    }

    return null;
  }
};

export default cloudinary;
