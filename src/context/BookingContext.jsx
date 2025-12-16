// src/context/BookingContext.jsx
import { createContext, useState } from "react";

export const BookingContext = createContext();

function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState({
    service: null,
    date: "",
    time: "",
    vehicleType: "",
  });

  function updateBooking(key, value) {
    setBookingData((prev) => ({ ...prev, [key]: value }));
  }

  function clearBooking() {
    setBookingData({
      service: null,
      date: "",
      time: "",
      vehicleType: "",
    });
  }

  return (
    <BookingContext.Provider
      value={{ bookingData, updateBooking, clearBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export default BookingProvider;
