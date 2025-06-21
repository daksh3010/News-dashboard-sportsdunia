import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { adminEmails } from "../utils/adminList";
import { useNavigate } from "react-router-dom";
import NewsChart from "../components/NewsChart";
import jsPDF from "jspdf";
import "jspdf-autotable"; 

export default function News() {
  const [fetchError, setFetchError] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { user } = useAuth();
  const isAdmin = adminEmails.includes(user?.email);

  const [payoutRate, setPayoutRate] = useState(() => {
    return Number(localStorage.getItem("payoutRate")) || 0;
  });

  const handlePayoutChange = (e) => {
    const value = Number(e.target.value);
    setPayoutRate(value);
    localStorage.setItem("payoutRate", value);
  };
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000); // Hide after 3 seconds
  };

  const totalPayout = payoutRate * filteredArticles.length;

  const authorSummary = {};
  filteredArticles.forEach((article) => {
    const name = article.author || "Unknown";
    authorSummary[name] = (authorSummary[name] || 0) + 1;
  });

  const authorData = Object.entries(authorSummary).map(([author, count]) => ({
    author,
    count,
    payout: payoutRate,
    total: payoutRate * count,
  }));

const handleExportCSV = () => {
  const csvRows = [
    ["Title", "Author", "Published Date", "Payout ($)"],
    ...filteredArticles.map((article) => {
      const author = article.author || "Unknown";
      const payout = payoutRate; 
      return [
        `"${article.title}"`,
        author,
        new Date(article.publishedAt).toLocaleDateString(),
        payout.toFixed(2),
      ];
    }),
  ];

  const csvContent = csvRows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "articles_payout_summary.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const fetchDevToBlogs = async () => {
  try {
    const res = await fetch("https://dev.to/api/articles?per_page=10");
    const data = await res.json();

    return data.map((item) => ({
      title: item.title,
      author: item.user.name,
      publishedAt: item.published_at,
      source: { name: "Dev.to" },
      url: item.url,
      type: "Blog",
    }));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }
};


const handleExportPDF = async () => {
  const jsPDFModule = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDFModule.jsPDF();
  autoTable(doc, {
    head: [["Title", "Author", "Published Date", "Payout ($)"]],
    body: filteredArticles.map((article) => [
      article.title,
      article.author || "Unknown",
      new Date(article.publishedAt).toLocaleDateString(),
      `$${payoutRate.toFixed(2)}`
    ]),
    startY: 22,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [99, 102, 241] }
  });

  doc.text("Article Payout Summary", 14, 16);
  doc.save("articles_payout_summary.pdf");
};




  const apiKey = import.meta.env.VITE_GUARDIAN_API_KEY;

  const fetchNews = async (pageNum = 1) => {
  setLoading(true);
  try {
    const res = await fetch(
      `https://content.guardianapis.com/search?api-key=${apiKey}&page-size=10&show-fields=byline,headline,short-url,publication`
    );
    const data = await res.json();

    const newsArticles = data.response.results.map((article) => ({
      title: article.webTitle,
      author: article.fields?.byline || "Unknown",
      publishedAt: article.webPublicationDate,
      source: { name: "The Guardian" },
      url: article.webUrl,
      type: "News",
    }));


    const blogArticles = await fetchDevToBlogs();

    const combined = [...newsArticles, ...blogArticles];

    if (combined.length === 0) {
      setHasMore(false);
    } else {
      setArticles((prev) => [...prev, ...combined]);
      setFilteredArticles((prev) => [...prev, ...combined]);
    }
  } catch (err) {
    console.error("Failed to fetch news or blogs:", err);
    setFetchError("Failed to fetch articles. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  useEffect(() => {
    let filtered = [...articles];

    if (search.trim()) {
      filtered = filtered.filter((article) =>
        article.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (author !== "all") {
      filtered = filtered.filter((article) => article.author === author);
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((article) => article.type === typeFilter);
    }

    if (startDate) {
      filtered = filtered.filter(
        (article) => new Date(article.publishedAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (article) => new Date(article.publishedAt) <= new Date(endDate)
      );
    }

    setFilteredArticles(filtered);
  }, [search, author, typeFilter, startDate, endDate, articles]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white bg-opacity-90 backdrop-blur-lg shadow-xl rounded-xl p-6">
       <div className="relative mb-6 h-10 flex items-center justify-end">
  <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-gray-800">
    📰 News Dashboard ({filteredArticles.length})
  </h1>
  <button
    onClick={() => navigate("/dashboard")}
    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
  >
    ← Back to Dashboard
  </button>
</div>



        <div className="flex flex-wrap gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="🔍 Search by keyword"
            className="p-2 border rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-2 border rounded w-full"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          >

            <option value="all">All Authors</option>
            {[...new Set(articles.map((a) => a.author).filter(Boolean))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
            <select 
              className="p-2 border rounded w-full" 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="News">News</option>
              <option value="Blog">Blog</option>
            </select>
          <div className="flex gap-2">
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="p-2 border rounded w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {fetchError && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 font-medium border border-red-300">
              {fetchError}
             </div>
)}
        </div>
            <NewsChart articles={filteredArticles} />

        {isAdmin && (
          <>
            <div className="mb-6 p-4 border rounded bg-gray-50">
              <h2 className="text-lg font-bold mb-2">💰 Admin Payout Calculator</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Payout per Article ($)</label>
                  <input
                    type="number"
                    min={0}
                    className="p-2 border rounded w-full"
                    value={payoutRate}
                    onChange={handlePayoutChange}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Total Payout</label>
                  <div className="p-2 border rounded bg-white font-semibold">
                    ${totalPayout.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 mt-4 border rounded">
              <h2 className="text-lg font-bold p-4 border-b bg-gray-100">📊 Payout Summary by Author</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-200 text-left">
                    <tr>
                      <th className="py-2 px-4">Author</th>
                      <th className="py-2 px-4">Articles</th>
                      <th className="py-2 px-4">Payout/Article</th>
                      <th className="py-2 px-4">Total Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authorData.map((row) => (
                      <tr key={row.author} className="border-b">
                        <td className="py-2 px-4">{row.author}</td>
                        <td className="py-2 px-4">{row.count}</td>
                        <td className="py-2 px-4">${row.payout.toFixed(2)}</td>
                        <td className="py-2 px-4 font-semibold">${row.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

           <div className="flex gap-4 justify-end mt-4">
<div className="flex gap-4 justify-center mt-4 mb-8">
  <button
    onClick={handleExportCSV}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    📤 Export as CSV
  </button>

  <button
    onClick={handleExportPDF}
    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
  >
    📄 Export as PDF
  </button>
</div>


</div>

          </>
        )}

        <div className="space-y-4">
          {filteredArticles.map((article, index) => (
            <div key={index} className="p-4 border rounded shadow bg-white">
              <h2 className="text-xl font-semibold text-gray-800">{article.title}</h2>
              <p className="text-sm text-gray-600">
                <strong>Author:</strong> {article.author || "Unknown"} <br />
                <strong>Date:</strong> {new Date(article.publishedAt).toLocaleDateString()} <br />
                <strong>Source:</strong> {article.source.name} <br />
                <strong>Type:</strong> {article.type}
              </p>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 inline-block"
              >
                Read More
              </a>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
              className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Show More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
