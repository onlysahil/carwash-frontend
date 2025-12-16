import axiosClient from "./axiosClient";

const bookingsApi = {
  getBookings: () => axiosClient.get("/bookings"),
};

export default bookingsApi;
