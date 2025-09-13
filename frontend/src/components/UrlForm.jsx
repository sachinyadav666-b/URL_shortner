import { useState } from "react";
import API from ".././services/api";

export default function UrlForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(originalUrl);
    try {
      console.log("Backend URL:", import.meta.env.VITE_API_URL);

      const res = await API.post("/short", { originalUrl }); // ✅ match backend
      console.log(res);
      setShortUrl(res.data);
      // setOriginalUrl("");
    } catch (err) {
      console.error(err);
      alert("Error generating short URL");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Shorten Your URL
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Enter your long URL..."
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={originalUrl}
          name="originalUrl"
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Shorten
        </button>
      </form>
      {shortUrl && (
        <div className="mt-5 flex flex-col items-center justify-center">
          <p className="text-gray-600">Your Short URL:</p>
          <a
            href={shortUrl?.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-medium hover:underline break-words"
          >
            {shortUrl?.shortUrl}
          </a>
          {shortUrl && <img src={shortUrl.qrCodeimg} alt="qrcode img" className="w-40 h-40"/>}
        </div>
      )}
    </div>
  );
}
