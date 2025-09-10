import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [urlsPerPage] = useState(5); // 👈 Number of items per page
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const res = await API.get("/urls", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrls(res.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching URLs. Maybe you are not logged in.");
        navigate("/admin/login");
      }
    };
    fetchUrls();
  }, [navigate]);

  // Pagination Logic
  const indexOfLastUrl = currentPage * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
  const currentUrls = urls.slice(indexOfFirstUrl, indexOfLastUrl);
  const totalPages = Math.ceil(urls.length / urlsPerPage);

  return (
    <div className="mt-6 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="mt-6">
        <table className="w-full border rounded-lg shadow-lg bg-white">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Original URL</th>
              <th className="p-3">Short URL</th>
              <th className="p-3">Visits</th>
              <th className="p-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {currentUrls.map((url) => (
              <tr key={url._id} className="border-t">
                <td className="p-3 max-w-xs truncate" title={url.originalUrl}>
                  {url.originalUrl}
                </td>
                <td className="p-3 text-indigo-600 break-words">
                  <a
                    href={`http://localhost:5002/${url.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    http://localhost:5002/{url.shortUrl}
                  </a>
                </td>
                <td className="p-3 text-center">{url.clicks}</td>
                <td className="p-3">
                  {new Date(url.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
