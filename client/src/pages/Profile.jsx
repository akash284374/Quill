// src/pages/Profile.jsx
import React from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();

  // Dummy user data (you can replace with real API later)
  const user = {
    name: "Akash Kumar Sah",
    bio: "Final year CSE (IoT) student | Passionate about building web apps",
    location: "Kolkata, India",
    joined: "January 2022",
    followers: 245,
    following: 180,
    posts: [
      { id: 1, content: "Just finished building my blog app!" },
      { id: 2, content: "Exploring Prisma + PostgreSQL 🔥" },
      { id: 3, content: "Learning system design concepts 📚" },
    ],
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
      {/* Cover Image */}
      <div className="relative w-full h-52 bg-gray-300 dark:bg-gray-800">
        <img
          src="https://source.unsplash.com/random/1200x400?landscape"
          alt="cover"
          className="w-full h-full object-cover"
        />
        {/* Profile Image */}
        <div className="absolute left-6 -bottom-16 w-32 h-32 border-4 border-white dark:border-[#0f0f0f] rounded-full overflow-hidden">
          <img
            src="https://avatars.githubusercontent.com/u/99132893?v=4"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-6 md:px-10">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">@{username}</p>
        <p className="mt-3">{user.bio}</p>

        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          <p>📍 {user.location}</p>
          <p>📅 Joined {user.joined}</p>
        </div>

        <div className="mt-3 flex gap-4 text-sm font-medium">
          <p>{user.followers} Followers</p>
          <p>{user.following} Following</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-300 dark:border-gray-700" />

      {/* Posts */}
      <div className="px-6 md:px-10">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="space-y-4">
          {user.posts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            >
              {post.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
