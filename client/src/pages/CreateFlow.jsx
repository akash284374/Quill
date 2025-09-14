import React, { useState } from "react";

const CreateFlow = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleCreate = () => {
    if (title.trim()) {
      setShowEditor(true);
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", "flow"); // you can customize tags
      formData.append("description", description);
      // if (coverImageFile) formData.append("file", coverImageFile);
      if (coverImageFile) formData.append("flowImage", coverImageFile);


      const res = await fetch("http://localhost:5000/api/posts/create", {
        method: "POST",
        body: formData,
        credentials: "include", // include cookies for auth if needed
      });

      const data = await res.json();
      if (res.ok) {
        alert("Flow posted successfully!");
        setTitle("");
        setDescription("");
        setContent("");
        setCoverImageFile(null);
        setCoverPreview(null);
        setShowEditor(false);
      } else {
        alert(data.message || "Failed to post flow");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen dark:bg-[#0f0f0f] text-white">
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
                <button
                  onClick={handlePublish}
                  className="bg-black text-white px-4 py-2 rounded border border-white hover:bg-white hover:text-black"
                >
                  Publish
                </button>
                <button
                  onClick={() => {
                    setShowEditor(false);
                    setTitle("");
                    setDescription("");
                    setContent("");
                    setCoverImageFile(null);
                    setCoverPreview(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Cover Image */}
          {/* Cover Image */}
<div className="bg-[#2a2f3a] h-60 rounded-xl flex items-center justify-center relative overflow-hidden">
  {coverPreview ? (
    <img
      src={coverPreview}
      alt="cover preview"
      className="w-full h-full object-cover rounded-xl"
    />
  ) : (
    <span className="text-gray-300 text-lg">Upload file</span>
  )}

  {/* Upload Button */}
  <label className="absolute right-4 bottom-4 bg-gray-200 text-black px-3 py-1 rounded hover:bg-white cursor-pointer">
    Upload file
    <input
      type="file"
      accept="image/*"
      onChange={handleCoverUpload}
      className="hidden" // hide the real input, label acts as button
    />
  </label>
</div>


            {/* Title */}
            <h1 className="text-4xl font-bold">{title}</h1>

            {/* Description */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the description here!!!"
              className="w-full text-lg italic bg-transparent text-gray-400 focus:outline-none"
            />

            <hr className="border-gray-700" />

            {/* Content */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
