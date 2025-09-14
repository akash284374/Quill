// server/src/controllers/postController.js
import prisma from "../../prisma/index.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

// ---------------- CREATE POST / FLOW ----------------
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Upload image if provided
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path);
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: imageUrl,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        author: { connect: { id: req.user.id } },
      },
    });

    return res.status(201).json({ message: "Flow created successfully", post });
  } catch (err) {
    console.error("createPost error:", err);
    return res.status(500).json({ message: "Failed to create flow" });
  }
};

// ---------------- GET ALL POSTS ----------------
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, username: true, profileImage: true } },
        likes: true,
        comments: {
          include: { user: { select: { id: true, username: true, profileImage: true } } },
        },
        views: true,
      },
    });

    return res.status(200).json({ posts });
  } catch (err) {
    console.error("getAllPosts error:", err);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// ---------------- GET SINGLE POST ----------------
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, profileImage: true } },
        likes: true,
        comments: {
          include: { user: { select: { id: true, username: true, profileImage: true } } },
        },
        views: true,
      },
    });

    if (!post) return res.status(404).json({ message: "Flow not found" });

    res.status(200).json({ post });
  } catch (err) {
    console.error("getPostById error:", err);
    res.status(500).json({ message: "Failed to fetch flow" });
  }
};