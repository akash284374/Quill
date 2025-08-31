import { FaRegCommentDots, FaRegHeart, FaEye } from "react-icons/fa";

export default function FlowCard({ flow }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mb-4 border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-1">{flow.title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{flow.date}</p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{flow.excerpt}</p>

      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-2">
          <FaEye /> {flow.views}
        </span>
        <span className="flex items-center gap-2">
          <FaRegHeart /> {flow.likes}
        </span>
        <span className="flex items-center gap-2">
          <FaRegCommentDots /> {flow.comments}
        </span>
      </div>
    </div>
  );
}
