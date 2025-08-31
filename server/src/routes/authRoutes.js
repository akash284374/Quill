import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  googleLogin,
  verifyOtp,
  getMe, // ✅ new controller
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ middleware to check token

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/google-login", googleLogin);
router.post("/verify-otp", verifyOtp);

// ✅ new route to check logged-in user
router.get("/me", protect, getMe);

export default router;
