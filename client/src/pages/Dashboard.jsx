import { useNavigate } from "react-router-dom";
import FlowCard from "../components/FlowCard"; // Optional if previewing flows

export default function Dashboard() {
  const navigate = useNavigate();

  const sampleFlows = [
    {
      id: 1,
      title: "epedemic",
      date: "July 27, 2025",
      excerpt: "This flow discusses the impact of epidemics...",
      views: 0,
      likes: 2,
      comments: 1,
    },
    {
      id: 2,
      title: "web",
      date: "July 27, 2025",
      excerpt: "Modern web development insights...",
      views: 1,
      likes: 5,
      comments: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Optional Preview */}
      <div className="grid gap-4">
        {sampleFlows.map((flow) => (
          <FlowCard key={flow.id} flow={flow} />
        ))}
      </div>

      {/* Navigate Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/all-flows")}
          className="bg-black text-white px-6 py-3 rounded-xl shadow hover:bg-gray-800 transition"
        >
          See All Flows →
        </button>
      </div>
    </div>
  );
}
