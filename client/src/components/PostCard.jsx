const PostCard = ({ title = "Sample Post", content = "This is a post.", author = "Akash" }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-black dark:text-white">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{content}</p>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Author: {author}</p>
    </div>
  );
};

export default PostCard; // ✅ Important!
