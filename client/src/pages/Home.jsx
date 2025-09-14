import React, { useEffect, useState } from "react";
import { FaBookmark, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setPosts(data.posts.reverse());
      else console.error(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Add view when post is loaded
  useEffect(() => {
    posts.forEach((post) => {
      fetch("http://localhost:5000/api/posts/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: post.id }),
      }).catch(console.error);
    });
  }, [posts]);

  // Handle like toggle
  const handleLike = async (postId) => {
    try {
      const res = await fetch("http://localhost:5000/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle bookmark toggle
  const handleBookmark = async (postId) => {
    try {
      const res = await fetch("http://localhost:5000/api/posts/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle adding comment
  const handleAddComment = async (postId, text) => {
    if (!text.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId, text }),
      });
      const data = await res.json();
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300 px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-6">

      {/* Feed List */}
      <div className="flex-1 space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition relative"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                {post.author.profileImage ? (
                  <img
                    src={post.author.profileImage}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white uppercase font-semibold">
                    {post.author.username?.[0] || "U"}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{post.author.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Title & Tags */}
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <div className="flex gap-2 flex-wrap mb-3">
                {post.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Cover Image */}
              {post.image && (
                <div className="mb-4">
                  <img
                    src={post.image}
                    alt="cover"
                    className="w-full max-h-64 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

              {/* Footer */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>{post.comments?.length || 0} Discuss</span>
                <span>•</span>
                <span>{post.likes?.length || 0} Likes</span>
                <span>•</span>
                <span>{post.views?.length || 0} Reads</span>
              </div>

              {/* Action Buttons */}
              {user && (
                <div className="flex items-center gap-4 mb-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 ${
                      post.likes.some((l) => l.userId === user.id)
                        ? "text-red-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <FaHeart /> Like
                  </button>
                  <button
                    onClick={() => handleBookmark(post.id)}
                    className={`flex items-center gap-1 ${
                      post.bookmarks.some((b) => b.userId === user.id)
                        ? "text-green-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <FaBookmark /> Bookmark
                  </button>
                </div>
              )}

              {/* Comments */}
              <div className="mt-2 space-y-2">
                {post.comments?.map((c) => (
                  <div key={c.id} className="flex items-start gap-2">
                    {c.user.profileImage ? (
                      <img
                        src={c.user.profileImage}
                        className="w-6 h-6 rounded-full object-cover"
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs">
                        {c.user.username[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">{c.user.username}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{c.text}</p>
                    </div>
                  </div>
                ))}

                {/* Add Comment Input */}
                {user && (
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white mt-2"
                    value={post.newComment || ""}
                    onChange={(e) =>
                      setPosts((prev) =>
                        prev.map((p) =>
                          p.id === post.id ? { ...p, newComment: e.target.value } : p
                        )
                      )
                    }
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && post.newComment?.trim()) {
                        await handleAddComment(post.id, post.newComment);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
            No posts yet. Be the first to create a flow!
          </p>
        )}

        {/* CTA for not logged in */}
        {!user && (
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold mb-4">Join Quill Today ✨</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Read unlimited blogs, share your thoughts, and connect with others.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/register"
                className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-500 text-white"
              >
                Create Account
              </a>
              <a
                href="/login"
                className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 text-white"
              >
                Login
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      {user && (
        <div className="w-full lg:w-64 hidden lg:block">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sticky top-24">
            <h3 className="text-lg font-semibold mb-2">Drafts</h3>
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last edited 1 week ago
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
