const DraftsPanel = () => {
  return (
    <div className="w-64 p-4 bg-white dark:bg-gray-900 border-l dark:border-gray-700 text-gray-900 dark:text-white transition-colors duration-100">
      <h2 className="text-lg font-semibold mb-2">Drafts (1)</h2>
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow transition-colors duration-300">
        <p className="font-semibold">Akash</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Last edited 1 week ago</p>
      </div>
    </div>
  );
};

export default DraftsPanel;
