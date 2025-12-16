import axios from "axios";
// import adminAxios from "../../utils/adminAxios";



const adminAxios = axios.create({
  baseURL: "http://127.0.0.1:8000/api/admin",
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminAxios;
