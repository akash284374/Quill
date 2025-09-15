import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser, // ✅ import new controller
  addComment,
  toggleLike,
  toggleBookmark,
  addView,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadFlowImage } from "../middleware/multerMiddleware.js";

const router = express.Router();

// ---------------- POST / FLOW ROUTES ----------------

// Create a new Flow / Post (with optional image)
router.post("/create", protect, uploadFlowImage, createPost);

// Fetch all posts / flows
router.get("/", getAllPosts);

// Fetch single post / flow by ID
router.get("/:id", getPostById);

// Fetch all posts of a specific user ✅
router.get("/user/:userId", getPostsByUser);

// ---------------- INTERACTIONS ----------------

// Add a comment to a post
router.post("/comment", protect, addComment);

// Toggle like on a post
router.post("/like", protect, toggleLike);

// Toggle bookmark on a post
router.post("/bookmark", protect, toggleBookmark);

// Add a view to a post
router.post("/view", protect, addView);

export default router;
