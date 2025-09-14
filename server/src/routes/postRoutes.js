import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadFlowImage } from "../middleware/multerMiddleware.js";

const router = express.Router();

// Create a new Flow / Post (with optional image)
router.post("/create", protect, uploadFlowImage, createPost);

// Fetch all posts / flows
router.get("/", getAllPosts);

// Fetch single post / flow by ID
router.get("/:id", getPostById);

export default router;
