import axios from "axios";

const API = axios.create({
   baseURL: "https://cafe-backend-production-27fe.up.railway.app",
//  baseURL: "http://localhost:8080", // your backend
});

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 403 || err.response?.status === 404) {
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

export default API;
