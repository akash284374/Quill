import React from "react";
import { FaBookmark } from "react-icons/fa";

const dummyPosts = [
  {
    id: 1,
    user: {
      name: "Vishal Kumar",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    time: "10 months ago",
    title: "Golang 101",
    tags: ["101", "golang"],
    content:
      "Introduction to GoLang (or simply Go) is a relatively new programming language created in 2009 by a team at Google. The language is designed to be simple, fast, and easy.",
    discussCount: 0,
    likes: 2,
    reads: 4,
  },
  {
    id: 2,
    user: {
      name: "teguh bagas",
      avatar: "",
    },
    time: "9 months ago",
    title: "ayongoding",
    tags: [],
    content: "ayo kita semua ngoding",
    discussCount: 1,
    likes: 0,
    reads: 6,
  },
  {
    id: 3,
    user: {
      name: "Pinku Numal",
      avatar: "",
    },
    time: "9 months ago",
    title: "Bvv",
    tags: ["scalableapp", "Bharat"],
    content: "undefined",
    discussCount: 0,
    likes: 0,
    reads: 0,
  },
];

const Feed = () => {
  return (
    <div className="w-full min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300 px-6 py-8 flex gap-8">
      {/* Feed List */}
      <div className="flex-1 space-y-6">
        {dummyPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition relative"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              {post.user.avatar ? (
                <img
                  src={post.user.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white uppercase font-semibold">
                  {post.user.name[0]}
                </div>
              )}
              <div>
                <p className="font-semibold">{post.user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{post.time}</p>
              </div>
            </div>

            {/* Title & Tags */}
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <div className="flex gap-2 flex-wrap mb-3">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

            {/* Footer */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{post.discussCount} Discuss</span>
              <span>•</span>
              <span>{post.likes} Likes</span>
              <span>•</span>
              <span>{post.reads} Reads</span>
            </div>

            {/* Bookmark Icon */}
            <div className="absolute top-6 right-6 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer">
              <FaBookmark />
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar: Draft Box */}
      <div className="w-64 hidden lg:block">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Drafts (1)</h3>
          <p className="font-medium">Akash</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last edited 1 week ago</p>
        </div>
      </div>
    </div>
  );
};

export default Feed;
