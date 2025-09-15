import express from "express";
import {
  getFriendsSuggestions,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  removeFriend,   // ✅ import new controller
} from "../controllers/followController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes with authentication
router.get("/suggestions", protect, getFriendsSuggestions);
router.post("/follow", protect, followUser);
router.post("/unfollow", protect, unfollowUser);
router.post("/remove-friend", protect, removeFriend); // ✅ new route
router.get("/followers/:userId", protect, getFollowers);
router.get("/following/:userId", protect, getFollowing);

export default router;
