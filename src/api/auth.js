
import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),

  register: (data) => axiosClient.post("/auth/signup", data),

  logout: () => axiosClient.post("/auth/logout"),

  getProfile: () => {
  const id = localStorage.getItem("user_id");
  return axiosClient.get(`/users/${id}`);
},

//   getUsers: () => axiosClient.get("/users"),

getUsers: () => {
    const token = localStorage.getItem("access_token");
    return axiosClient.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateProfile: (data) => axiosClient.put("/auth/me", data),

  forgotPassword: (email) =>
    axiosClient.post("/auth/forget-password", { email }),
};




export default authApi;





