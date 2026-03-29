import axios from "axios";

const API = axios.create({
  baseURL: "https://cafe-backend-production-27fe.up.railway.app", // your backend
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
    if (err.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
