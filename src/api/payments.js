// src/api/payments.js
import axiosClient from "./axiosClient";

const paymentsApi = {
  createOrder: (data) => axiosClient.post("/payments/create-order/", data),

  verifyPayment: (data) => axiosClient.post("/payments/verify/", data)
};

export default paymentsApi;
