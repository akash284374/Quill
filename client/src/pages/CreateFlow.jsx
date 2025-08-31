import React, { useState } from "react";

const CreateFlow = () => {
  const [title, setTitle] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const handleCreate = () => {
    if (title.trim()) {
      setShowEditor(true);
    }
  };

  return (
    <div className="flex min-h-screen dark:bg-[#0f0f0f] text-white">
      {/* Sidebar here if needed */}

      <div className="flex-1 p-6">
        {!showEditor ? (
          // Step 1: Title Entry Modal
          <div className="bg-[#141414] border border-gray-700 rounded-xl p-6 max-w-md mx-auto mt-20 shadow-lg relative">
            <button
              onClick={() => setTitle("")}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Write Your Flow</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full px-4 py-2 rounded border border-gray-700 bg-[#0f0f0f] text-white focus:outline-none"
              />
            </div>
            <button
              onClick={handleCreate}
              className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-white transition"
            >
              Create Flow
            </button>
          </div>
        ) : (
          // Step 2: Editor after title input
          <div className="max-w-4xl mx-auto mt-10 space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-500">Saved!</span>
              <div className="flex gap-3">
                <button className="bg-black text-white px-4 py-2 rounded border border-white hover:bg-white hover:text-black">
                  Publish
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-[#2a2f3a] h-60 rounded-xl flex items-center justify-center relative">
              <span className="text-gray-300 text-lg">Upload file</span>
              <button className="absolute right-4 bottom-4 bg-gray-200 text-black px-3 py-1 rounded hover:bg-white">
                Upload file
              </button>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold">{title}</h1>

            {/* Description */}
            <input
              type="text"
              placeholder="Enter the description here!!!"
              className="w-full text-lg italic bg-transparent text-gray-400 focus:outline-none"
            />

            <hr className="border-gray-700" />

            {/* Content */}
            <textarea
              placeholder="Write with your flow!!!"
              rows={6}
              className="w-full bg-transparent text-white resize-none focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateFlow;
