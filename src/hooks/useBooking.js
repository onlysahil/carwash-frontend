// src/hooks/useBooking.js
import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";

export default function useBooking() {
  return useContext(BookingContext);
}
