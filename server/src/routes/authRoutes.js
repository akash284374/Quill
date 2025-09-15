import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  googleLogin,
  verifyOtp,
  getMe,
  getUserProfile,   // ✅ new controller
  updateProfileImage,
  updateCoverImage,
  updateBio,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { uploadProfileImage, uploadCoverImage } from "../middleware/multerMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyOtp);

// User session
router.get("/me", protect, getMe);

// Public profile (view another user)
router.get("/profile/:userId", protect, getUserProfile); // ✅ added

// Profile & Cover image upload
router.put("/update-profile-image", protect, uploadProfileImage, updateProfileImage);
router.put("/update-cover-image", protect, uploadCoverImage, updateCoverImage);

// Bio update
router.put("/update-bio", protect, updateBio);

export default router;
