import React from "react";
import { FiUserPlus } from "react-icons/fi";

const dummyFriends = [
  {
    id: 1,
    name: "Riya Sharma",
    bio: "UI/UX Designer • Coffee Lover ☕",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Vikram Sinha",
    bio: "Building apps at DevHub • React.js 🔥",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Tina Patel",
    bio: "Writer at WriteFlow ✍️",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

const Friends = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Friends</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyFriends.map((friend) => (
          <div
            key={friend.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold">{friend.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{friend.bio}</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2">
              <FiUserPlus /> Follow Back
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Friends;
