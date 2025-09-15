import express from "express";
import {
  getFriendsSuggestions,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from "../controllers/followController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ Updated middleware name

const router = express.Router();

// Routes with authentication
router.get("/suggestions", protect, getFriendsSuggestions);
router.post("/follow", protect, followUser);
router.post("/unfollow", protect, unfollowUser);
router.get("/followers/:userId", protect, getFollowers);
router.get("/following/:userId", protect, getFollowing);

export default router;
