import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5002/api/", // backend server URL
});

// Attach JWT token automatically (if available)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

export default API;
