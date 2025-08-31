import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
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
