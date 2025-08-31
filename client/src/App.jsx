// src/App.jsx
import React, { useState } from "react";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
      <AppRoutes searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};

export default App;
