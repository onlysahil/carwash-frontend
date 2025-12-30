import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import ThankYouComponent from "../../components/ThankYouComponent/ThankYouComponent";
import "./Booking.css";

function Booking() {
  const location = useLocation();
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
      const srv = services.find((s) => s._id === id);
      return srv ? sum + srv.price : sum;
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

const token = localStorage.getItem("token"); // <-- match the login key
if (!token) {
  navigate("/login", {
    state: {
      message: "Please login or create an account to book a service",
    },
  });
  return;
}

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
    setShowThankYou(true);
    

    setTimeout(() => {
      navigate("/profile");
    }, 3000);
  } catch (err) {
    alert(err.response?.data?.message || "Booking failed");
  } finally {
    setIsSubmitting(false);
  }
}

  if (showThankYou) return <ThankYouComponent />;
  if (loading) return <Loader />;
  if (error) return <p className="error">{error}</p>;

  return (
    <>

    {location.state?.message && (
  <p className="login-warning">
    {location.state.message}
  </p>
)}
      {/* ===== HERO BANNER ===== */}
      <div className="booking-hero">
        <h1>Booking</h1>
      </div>

      {/* ===== BOOKING CARD ===== */}
      <div className="booking-page">
        <form className="booking-form" onSubmit={handleSubmit}>
          {/* CUSTOMER DETAILS (RECEPTIONIST ONLY) */}
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

          {/* ===== SERVICES CHECKBOX CARDS ===== */}

          <h1>Book A Service</h1>
          <label className="service-label">Services</label>

          <div className="service-grid">
            {services.map((srv) => {
              const selected = form.serviceIds.includes(srv._id);

              return (
                <div
                  key={srv._id}
                  className={`service-card ${selected ? "selected" : ""}`}
                  onClick={() =>
                    setForm({
                      ...form,
                      serviceIds: selected
                        ? form.serviceIds.filter((id) => id !== srv._id)
                        : [...form.serviceIds, srv._id],
                    })
                  }
                >
                  <div className="service-info">
                    <p className="service-title">{srv.title}</p>
                    <span className="service-price">₹{srv.price}</span>
                  </div>

                  <input type="checkbox" checked={selected} readOnly />
                </div>
              );
            })}
          </div>

          {/* LOCATION */}
          <label>
            Location
            <input
              type="text"
              placeholder="Enter Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              required
            />
          </label>

          {/* DATE */}
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

          {/* TIME */}
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

          {/* VEHICLE */}
          <label>
            Vehicle Model
            <input
              type="text"
              placeholder="Enter Vehicle Model"
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
              placeholder="Enter Vehicle Number"
              value={form.vehicleNumber}
              onChange={(e) =>
                setForm({ ...form, vehicleNumber: e.target.value })
              }
              required
            />
          </label>

          {/* TOTAL */}
          <p>
            Total Amount : ₹{calculateTotal()}
          </p>

          {/* SUBMIT */}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Create Booking"}
          </button>
          
        </form>
      </div>
    </>
  );
}

export default Booking;