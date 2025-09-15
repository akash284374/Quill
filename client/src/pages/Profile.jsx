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
  const [bio, setBio] = useState(user?.bio || "");

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Cleanup previews
  useEffect(() => {
    return () => {
      profilePreview && URL.revokeObjectURL(profilePreview);
      coverPreview && URL.revokeObjectURL(coverPreview);
    };
  }, [profilePreview, coverPreview]);

  useEffect(() => {
    setBio(user?.bio || "");
  }, [user]);

  // Fetch profile-related data
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfileData = async () => {
      try {
        // Followers, Following
        const [followersRes, followingRes, postsRes, suggestionsRes] =
          await Promise.all([
            fetch(`http://localhost:5000/api/follow/followers/${user.id}`, { credentials: "include" }),
            fetch(`http://localhost:5000/api/follow/following/${user.id}`, { credentials: "include" }),
            fetch(`http://localhost:5000/api/posts/user/${user.id}`, { credentials: "include" }),
            fetch(`http://localhost:5000/api/follow/suggestions`, { credentials: "include" }),
          ]);

        const [followersData, followingData, postsData, suggestionsData] =
          await Promise.all([
            followersRes.json(),
            followingRes.json(),
            postsRes.json(),
            suggestionsRes.json(),
          ]);

        setFollowers(followersData.followers || []);
        setFollowing(followingData.following || []);
        setFriends(followersData.followers.filter(f => followingData.following.some(fn => fn.id === f.id))); // mutual = friends
        setPosts(postsData.posts || []);
        setSuggestions(suggestionsData.suggestions || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [user]);

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

      if (profileFile) {
        const formData = new FormData();
        formData.append("profileImage", profileFile);
        const res = await fetch("http://localhost:5000/api/auth/update-profile-image", { method: "PUT", body: formData, credentials: "include" });
        const data = await res.json();
        updatedUser.profileImage = data.user.profileImage || null;
        setProfileFile(null); setProfilePreview(null);
      }

      if (coverFile) {
        const formData = new FormData();
        formData.append("coverImage", coverFile);
        const res = await fetch("http://localhost:5000/api/auth/update-cover-image", { method: "PUT", body: formData, credentials: "include" });
        const data = await res.json();
        updatedUser.coverImage = data.user.coverImage || null;
        setCoverFile(null); setCoverPreview(null);
      }

      if (bio !== user.bio) {
        const res = await fetch("http://localhost:5000/api/auth/update-bio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bio }),
          credentials: "include",
        });
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

  const handleFollow = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/api/follow/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followeeId: id }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to follow");
      const data = await res.json();
      setSuggestions(prev => prev.filter(u => u.id !== id));
      setFollowing(prev => [...prev, { id }]); // simple update
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollow = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/api/follow/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followeeId: id }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to unfollow");
      setFollowing(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  if (!user) return <div className="flex justify-center items-center min-h-screen">User not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
      {/* Cover & Profile */}
      <div className="relative h-60 bg-gray-300 dark:bg-gray-800">
        <img src={coverPreview || user.coverImage || defaultCover} alt="cover" className="w-full h-full object-cover rounded-b-2xl" onError={e => (e.target.src = defaultCover)} />
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
          <div className="w-32 h-32 border-4 border-white dark:border-[#0f0f0f] rounded-full overflow-hidden shadow-lg">
            <img src={profilePreview || user.profileImage || defaultProfile} alt="profile" className="w-full h-full object-cover" onError={e => (e.target.src = defaultProfile)} />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 text-center px-6">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        <p className="mt-3 text-lg">{user.bio || "No bio available"}</p>
        <button onClick={() => setIsEditing(true)} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Edit Profile</button>

        {/* Stats */}
        <div className="mt-6 flex justify-center gap-8 text-sm font-medium">
          <div><p className="text-xl font-bold">{followers.length}</p><p className="text-gray-500 dark:text-gray-400">Followers</p></div>
          <div><p className="text-xl font-bold">{following.length}</p><p className="text-gray-500 dark:text-gray-400">Following</p></div>
          <div><p className="text-xl font-bold">{friends.length}</p><p className="text-gray-500 dark:text-gray-400">Friends</p></div>
        </div>
      </div>

      {/* Friend Suggestions */}
      <div className="px-6 md:px-20 mt-10">
        <h2 className="text-xl font-semibold mb-3">Friend Suggestions</h2>
        {suggestions.length ? (
          <div className="flex flex-wrap gap-4">
            {suggestions.map(s => (
              <div key={s.id} className="flex items-center gap-2 border p-2 rounded-lg">
                <img src={s.profileImage || defaultProfile} alt={s.username} className="w-10 h-10 rounded-full" />
                <span>{s.name || s.username}</span>
                <button onClick={() => handleFollow(s.id)} className="ml-auto px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Follow</button>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500">No suggestions available.</p>}
      </div>

      {/* Posts */}
      <div className="my-8 border-t border-gray-300 dark:border-gray-700" />
      <div className="px-6 md:px-20">
        <h2 className="text-2xl font-semibold mb-6">My Posts</h2>
        {posts.length ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-md transition">
                {post.title && <h3 className="font-semibold mb-2">{post.title}</h3>}
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <label className="block mb-3">
              <span className="text-sm font-medium">Profile Picture</span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profile")} className="mt-1 block w-full text-sm text-gray-500" />
            </label>
            <label className="block mb-3">
              <span className="text-sm font-medium">Cover Picture</span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "cover")} className="mt-1 block w-full text-sm text-gray-500" />
            </label>
            <label className="block mb-3">
              <span className="text-sm font-medium">Bio</span>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1 block w-full p-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white" placeholder="Write something about yourself..." />
            </label>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-400">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
