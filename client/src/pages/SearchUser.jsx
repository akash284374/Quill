import React, { useState, useEffect } from "react";
import { FiSearch, FiUserPlus } from "react-icons/fi";

const dummyUsers = [
  { id: 1, name: "Amit Roy", bio: "MERN Developer", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "Sneha Verma", bio: "Tech Blogger", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: 3, name: "Rahul Dev", bio: "Fullstack Engineer", avatar: "https://i.pravatar.cc/150?img=13" },
  { id: 4, name: "Nisha Singh", bio: "Content Writer", avatar: "https://i.pravatar.cc/150?img=14" },
];

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(dummyUsers);

  useEffect(() => {
    const results = dummyUsers.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Search Users</h2>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl mb-6">
        <FiSearch className="text-gray-500 dark:text-gray-300 mr-2" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none w-full text-gray-900 dark:text-white"
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.bio}</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2">
              <FiUserPlus /> Follow
            </button>
          </div>
        ))}
      </div>

      {/* No Match Message */}
      {filteredUsers.length === 0 && (
        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          No users found.
        </p>
      )}
    </div>
  );
};

export default SearchUser;
