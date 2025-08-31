// src/pages/Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import defaultProfile from "../assets/defaultProfile.png"; // add a local image in src/assets
import defaultCover from "../assets/defaultCover.png";     // add a local image in src/assets

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        User not found
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
      {/* Cover Image */}
      <div className="relative h-60 bg-gray-300 dark:bg-gray-800">
        <img
          src={user.coverImage || defaultCover}
          alt="cover"
          className="w-full h-full object-cover rounded-b-2xl"
        />

        {/* Profile Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
          <div className="w-32 h-32 border-4 border-white dark:border-[#0f0f0f] rounded-full overflow-hidden shadow-lg">
            <img
              src={user.profileImage || defaultProfile}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 text-center px-6">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        <p className="mt-3 text-lg">{user.bio || "No bio available"}</p>

        <div className="mt-4 flex justify-center gap-8 text-sm font-medium">
          <div>
            <p className="text-xl font-bold">{user.followers?.length || 0}</p>
            <p className="text-gray-500 dark:text-gray-400">Followers</p>
          </div>
          <div>
            <p className="text-xl font-bold">{user.following?.length || 0}</p>
            <p className="text-gray-500 dark:text-gray-400">Following</p>
          </div>
          <div>
            <p className="text-xl font-bold">{user.friends?.length || 0}</p>
            <p className="text-gray-500 dark:text-gray-400">Friends</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-8 border-t border-gray-300 dark:border-gray-700" />

      {/* Posts */}
      <div className="px-6 md:px-20">
        <h2 className="text-2xl font-semibold mb-6">Posts</h2>
        {user.posts && user.posts.length > 0 ? (
          <div className="space-y-6">
            {user.posts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-md transition"
              >
                {post.title && <h3 className="font-semibold mb-2">{post.title}</h3>}
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
