import axios from "axios";
// import dotenv from "dotenv";


const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/`, // backend server URL
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
