import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import ThankYouComponent from "../../components/ThankYouComponent/ThankYouComponent";

import "./Booking.css";

function Booking() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

const [isSubmitting, setIsSubmitting] = useState(false);
const [showThankYou, setShowThankYou] = useState(false);

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");

  const isReceptionist = role === "receptionist";
  const isCustomer = role === "customer";

  const [form, setForm] = useState({
    customerName: localStorage.getItem("name") || "",
    customerEmail: localStorage.getItem("email") || "",
    customerPhone: localStorage.getItem("phone") || "",
    serviceIds: [],
    location: "",
    date: "",
    time: "",
    vehicleModel: "",
    vehicleNumber: "",
    paymentMethod: "prepaid",
  });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const res = await axiosClient.get("/services");
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  const calculateTotal = () =>
    form.serviceIds.reduce((sum, id) => {
      const s = services.find((srv) => srv._id === id);
      return s ? sum + s.price : sum;
    }, 0);

  const convertToAMPM = (time24) => {
    if (!time24) return "";
    let [h, m] = time24.split(":");
    h = parseInt(h, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  async function handleSubmit(e) {
  e.preventDefault();

  setIsSubmitting(true);

  const payload = {
    userId: isCustomer ? userId : null,
    customerName: form.customerName,
    customerEmail: form.customerEmail,
    customerPhone: form.customerPhone,
    serviceIds: form.serviceIds,
    location: form.location,
    date: form.date,
    time: convertToAMPM(form.time),
    vehicleModel: form.vehicleModel,
    vehicleNumber: form.vehicleNumber,
    bookingStatus: "pending",
    paymentMethod: form.paymentMethod,
  };

  try {
    await axiosClient.post("/bookings", payload);

    // 🎉 SHOW THANK YOU SCREEN
    setShowThankYou(true);

    // ⏳ REDIRECT AFTER 3 SECONDS
    setTimeout(() => {
      navigate("/profile");
    }, 3000);
  } catch (err) {
    alert(err.response?.data?.message || "Booking failed");
  } finally {
    setIsSubmitting(false);
  }
}

if (showThankYou) {
  return <ThankYouComponent />;
}

  if (loading) return <Loader />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="booking-page">
      <h1>Create Booking</h1>

      <form className="booking-form" onSubmit={handleSubmit}>

        {/* 👇 CUSTOMER DETAILS ONLY FOR RECEPTIONIST */}
        {isReceptionist && (
          <>
            <label>
              Customer Name
              <input
                type="text"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                required
              />
            </label>

            <label>
              Customer Email
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
                required
              />
            </label>

            <label>
              Customer Phone
              <input
                type="tel"
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
                required
              />
            </label>
          </>
        )}

        {/* SERVICES */}
        <label>
          Services (Hold Ctrl / Cmd to select multiple)
          <select
            multiple
            className="service-select"
            value={form.serviceIds}
            onChange={(e) =>
              setForm({
                ...form,
                serviceIds: Array.from(
                  e.target.selectedOptions,
                  (o) => o.value
                ),
              })
            }
            required
          >
            {services.map((srv) => (
              <option key={srv._id} value={srv._id}>
                {srv.title} — ₹{srv.price}
              </option>
            ))}
          </select>
        </label>

        <label>
          Location
          <input
            type="text"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            required
          />
        </label>

        <label>
          Date
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            required
          />
        </label>

        <label>
          Time
          <input
            type="time"
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
            required
          />
        </label>

        <label>
          Vehicle Model
          <input
            type="text"
            value={form.vehicleModel}
            onChange={(e) =>
              setForm({ ...form, vehicleModel: e.target.value })
            }
            required
          />
        </label>

        <label>
          Vehicle Number
          <input
            type="text"
            value={form.vehicleNumber}
            onChange={(e) =>
              setForm({ ...form, vehicleNumber: e.target.value })
            }
            required
          />
        </label>

        <p>
          <strong>Total Amount: ₹{calculateTotal()}</strong>
        </p>

        <button type="submit" disabled={isSubmitting}>
  {isSubmitting ? "Booking..." : "Book Now"}
</button>
      </form>
    </div>
  );
}

export default Booking;