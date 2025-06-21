import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = [
  "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#14B8A6", "#EC4899", "#F43F5E", "#22C55E", "#3B82F6"
];

export default function NewsChart({ articles }) {
  // Bar Chart Data: Author-wise count
  const authorCount = {};
  const sourceCount = {};

  articles.forEach((article) => {
    const author = article.author || "Unknown";
    const source = article.source?.name || "Unknown";

    authorCount[author] = (authorCount[author] || 0) + 1;
    sourceCount[source] = (sourceCount[source] || 0) + 1;
  });

  const barChartData = Object.entries(authorCount).map(([author, count]) => ({
    author,
    count,
  }));

  const pieChartData = Object.entries(sourceCount).map(([source, count]) => ({
    name: source,
    value: count,
  }));

  return (
    <div className="bg-white rounded shadow p-4 mt-6 space-y-10">
      {/* 📊 Bar Chart: Articles by Author */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-800">📊 Articles by Author</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="author" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 Pie Chart: Source Distribution */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-800">🥧 Article Distribution by Source</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieChartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
