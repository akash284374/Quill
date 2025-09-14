import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const Layout = ({ searchQuery, setSearchQuery }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth(); // 👈 get auth state
  const isHome = location.pathname === "/";

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar only on Home AND logged in */}
      {isHome && isAuthenticated && <Sidebar />}

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Navbar always visible */}
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
