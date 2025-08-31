import { FaSun, FaMoon, FaSearch, FaUserCircle } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ onSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Left: Logo */}
      <h1 className="text-xl font-semibold">Quill</h1>

      {/* Center: Search bar */}
      <div className="relative w-full max-w-md mx-6 hidden sm:block">
        <input
          type="text"
          placeholder="Search by user name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Right side: Home button + Icons */}
      <div className="flex items-center space-x-4">
        {/* Show Back to Home only if not on Home */}
        {!isHome && (
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Home
          </Link>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>

        {/* Profile Icon */}
        <button
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Profile"
        >
          <FaUserCircle size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
