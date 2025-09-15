// server/src/controllers/followController.js
import prisma from "../../prisma/index.js";

// Get friend suggestions (users not followed yet)
export const getFriendsSuggestions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // All users except logged-in user
    const allUsers = await prisma.user.findMany({
      where: { id: { not: userId } },
      select: { id: true, name: true, username: true, profileImage: true, bio: true },
    });

    // Users already followed
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followeeId: true },
    });
    const followingIds = following.map((f) => f.followeeId);

    // Filter users not followed yet
    const suggestions = allUsers.filter((u) => !followingIds.includes(u.id));

    res.status(200).json({ suggestions });
  } catch (err) {
    console.error("Error in getFriendsSuggestions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { followeeId } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (userId === followeeId) return res.status(400).json({ message: "Cannot follow yourself" });

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: { followerId_followeeId: { followerId: userId, followeeId } },
    });

    if (existingFollow)
      return res.status(400).json({ message: "Already following" });

    const follow = await prisma.follow.create({
      data: { followerId: userId, followeeId },
    });

    res.status(201).json({ message: "Followed successfully", follow });
  } catch (err) {
    console.error("Error in followUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { followeeId } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    await prisma.follow.delete({
      where: { followerId_followeeId: { followerId: userId, followeeId } },
    });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Error in unfollowUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove Friend (mutual remove)
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { friendId } = req.body;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Delete both directions (if exist)
    await prisma.follow.deleteMany({
      where: {
        OR: [
          { followerId: userId, followeeId: friendId },
          { followerId: friendId, followeeId: userId },
        ],
      },
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error("Error in removeFriend:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all followers of a user
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await prisma.follow.findMany({
      where: { followeeId: userId },
      include: { follower: { select: { id: true, name: true, username: true, profileImage: true } } },
    });

    res.status(200).json({ followers: followers.map(f => f.follower) });
  } catch (err) {
    console.error("Error in getFollowers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users that a user is following
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: { followee: { select: { id: true, name: true, username: true, profileImage: true } } },
    });

    res.status(200).json({ following: following.map(f => f.followee) });
  } catch (err) {
    console.error("Error in getFollowing:", err);
    res.status(500).json({ message: "Server error" });
  }
};
