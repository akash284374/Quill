// server/src/controllers/postController.js
import prisma from "../../prisma/index.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

// ---------------- CREATE POST / FLOW ----------------
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!req.user?.id) {
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
        bookmarks: true,
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
        bookmarks: true,
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

// ---------------- ADD COMMENT ----------------
export const addComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const comment = await prisma.comment.create({
      data: { postId, userId: req.user.id, text },
      include: { user: { select: { id: true, username: true, profileImage: true } } },
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// ---------------- TOGGLE LIKE ----------------
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: req.user.id, postId } },
    });

    if (existing) {
      await prisma.like.delete({
        where: { userId_postId: { userId: req.user.id, postId } },
      });
      return res.status(200).json({ message: "Like removed" });
    }

    await prisma.like.create({ data: { userId: req.user.id, postId } });
    res.status(201).json({ message: "Post liked" });
  } catch (err) {
    console.error("toggleLike error:", err);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

// ---------------- TOGGLE BOOKMARK ----------------
export const toggleBookmark = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const existing = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId: req.user.id, postId } },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { userId_postId: { userId: req.user.id, postId } },
      });
      return res.status(200).json({ message: "Bookmark removed" });
    }

    await prisma.bookmark.create({ data: { userId: req.user.id, postId } });
    res.status(201).json({ message: "Post bookmarked" });
  } catch (err) {
    console.error("toggleBookmark error:", err);
    res.status(500).json({ message: "Failed to toggle bookmark" });
  }
};

// ---------------- ADD VIEW ----------------
export const addView = async (req, res) => {
  try {
    const { postId } = req.body;

    await prisma.view.create({
      data: { postId, userId: req.user?.id || null },
    });

    res.status(201).json({ message: "View added" });
  } catch (err) {
    console.error("addView error:", err);
    res.status(500).json({ message: "Failed to add view" });
  }
};
