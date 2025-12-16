import axiosClient from "./axiosClient";

const servicesApi = {
  getServices: () => axiosClient.get("/services"),
};

export default servicesApi;
