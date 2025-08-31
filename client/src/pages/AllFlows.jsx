import FlowCard from "../components/FlowCard";

const mockFlows = [
  {
    id: 1,
    title: "epedemic",
    date: "July 27, 2025",
    excerpt: "This flow discusses the impact of epidemics on society...",
    views: 0,
    likes: 2,
    comments: 1,
  },
  {
    id: 2,
    title: "web",
    date: "July 27, 2025",
    excerpt: "An article about modern web development practices.",
    views: 1,
    likes: 5,
    comments: 3,
  },
];

export default function AllFlowsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        All Flows
      </h1>
      {mockFlows.map((flow) => (
        <FlowCard key={flow.id} flow={flow} />
      ))}
    </div>
  );
}
