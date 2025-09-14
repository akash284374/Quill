import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import defaultProfile from "../assets/defaultProfile.png";
import defaultCover from "../assets/defaultCover.png";

const Profile = () => {
  const { user, loading, setUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [bio, setBio] = useState(user?.bio || ""); // ✅ new state for bio

  useEffect(() => {
    return () => {
      profilePreview && URL.revokeObjectURL(profilePreview);
      coverPreview && URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);

  useEffect(() => {
    setBio(user?.bio || "");
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        User not found
      </div>
    );
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(file);
      setProfilePreview(preview);
    } else if (type === "cover") {
      setCoverFile(file);
      setCoverPreview(preview);
    }
  };

  const handleSave = async () => {
    try {
      let updatedUser = { ...user };

      // Upload profile image
      if (profileFile) {
        const formData = new FormData();
        formData.append("profileImage", profileFile);

        const res = await fetch(
          "http://localhost:5000/api/auth/update-profile-image",
          { method: "PUT", body: formData, credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to upload profile image");
        const data = await res.json();
        updatedUser.profileImage = data.user.profileImage || null;
        setProfileFile(null);
        setProfilePreview(null);
      }

      // Upload cover image
      if (coverFile) {
        const formData = new FormData();
        formData.append("coverImage", coverFile);

        const res = await fetch(
          "http://localhost:5000/api/auth/update-cover-image",
          { method: "PUT", body: formData, credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to upload cover image");
        const data = await res.json();
        updatedUser.coverImage = data.user.coverImage || null;
        setCoverFile(null);
        setCoverPreview(null);
      }

      // Update bio
      if (bio !== user.bio) {
        const res = await fetch(
          "http://localhost:5000/api/auth/update-bio",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bio }),
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to update bio");
        const data = await res.json();
        updatedUser.bio = data.user.bio || "";
      }

      setUser(updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
      {/* Cover */}
      <div className="relative h-60 bg-gray-300 dark:bg-gray-800">
        <img
          src={coverPreview || user.coverImage || defaultCover}
          alt="cover"
          className="w-full h-full object-cover rounded-b-2xl"
          onError={(e) => (e.target.src = defaultCover)}
        />
        {/* Profile picture */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
          <div className="w-32 h-32 border-4 border-white dark:border-[#0f0f0f] rounded-full overflow-hidden shadow-lg">
            <img
              src={profilePreview || user.profileImage || defaultProfile}
              alt="profile"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = defaultProfile)}
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 text-center px-6">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        <p className="mt-3 text-lg">{user.bio || "No bio available"}</p>

        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Edit Profile
        </button>

        <div className="mt-6 flex justify-center gap-8 text-sm font-medium">
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

      {/* Posts */}
      <div className="my-8 border-t border-gray-300 dark:border-gray-700" />
      <div className="px-6 md:px-20">
        <h2 className="text-2xl font-semibold mb-6">Posts</h2>
        {user.posts?.length ? (
          <div className="space-y-6">
            {user.posts.map((post) => (
              <div
                key={post._id || post.id}
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

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <label className="block mb-3">
              <span className="text-sm font-medium">Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profile")}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm font-medium">Cover Picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "cover")}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm font-medium">Bio</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-1 block w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white"
                placeholder="Write something about yourself..."
              />
            </label>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
