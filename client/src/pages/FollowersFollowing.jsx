import React, { useEffect, useState } from "react";
import axios from "axios";
import Friends from "./Friends";
import { FiUserX } from "react-icons/fi";

const FollowersFollowingPage = () => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unfollowLoading, setUnfollowLoading] = useState({});

  // Fetch followers and following
  const fetchData = async () => {
    try {
      setLoading(true);
      const [followersRes, followingRes] = await Promise.all([
        axios.get("http://localhost:5000/api/follow/followers/me", { withCredentials: true }),
        axios.get("http://localhost:5000/api/follow/following/me", { withCredentials: true }),
      ]);

      setFollowers(followersRes.data.followers || []);
      setFollowing(followingRes.data.following || []);
    } catch (err) {
      console.error("Error fetching followers/following:", err);
      setError("Failed to load followers/following.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle unfollow from following list
  const handleUnfollow = async (userId) => {
    try {
      setUnfollowLoading((prev) => ({ ...prev, [userId]: true }));
      await axios.post(
        "http://localhost:5000/api/follow/unfollow",
        { followeeId: userId },
        { withCredentials: true }
      );
      setFollowing((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error unfollowing user:", err);
      alert(err.response?.data?.message || "Failed to unfollow user.");
    } finally {
      setUnfollowLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Callback when a new user is followed from Friend Suggestions
  const handleUpdateFollowing = (friendId, followData) => {
    setFollowing((prev) => [...prev, followData.followee]);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading followers/following...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Friend Suggestions */}
      <Friends onUpdateFollowing={handleUpdateFollowing} />

      {/* Followers List */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Followers</h2>
      {followers.length === 0 ? (
        <p className="text-gray-500">You have no followers yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {followers.map((f) => (
            <div
              key={f.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={f.profileImage || `https://i.pravatar.cc/150?u=${f.id}`}
                  alt={f.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{f.name}</h3>
                  <p className="text-sm text-gray-500">{f.username}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Following List */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Following</h2>
      {following.length === 0 ? (
        <p className="text-gray-500">You are not following anyone yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {following.map((f) => (
            <div
              key={f.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={f.profileImage || `https://i.pravatar.cc/150?u=${f.id}`}
                  alt={f.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{f.name}</h3>
                  <p className="text-sm text-gray-500">{f.username}</p>
                </div>
              </div>
              <button
                disabled={unfollowLoading[f.id]}
                onClick={() => handleUnfollow(f.id)}
                className="py-1 px-3 rounded-xl flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white transition"
              >
                {unfollowLoading[f.id] ? "Processing..." : <><FiUserX /> Unfollow</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowersFollowingPage;
