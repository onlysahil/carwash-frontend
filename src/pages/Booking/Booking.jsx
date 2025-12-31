import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader/Loader";
import ThankYouComponent from "../../components/ThankYouComponent/ThankYouComponent";
import "./Booking.css";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("user_id");
  const isReceptionist = role === "receptionist";

  const [form, setForm] = useState({
    customerName: localStorage.getItem("name") || "",
    customerEmail: localStorage.getItem("email") || "",
    customerPhone: localStorage.getItem("phone") || "",
    packageId: "",
    addOnIds: [],
    vehicleType: "",
    location: "",
    date: "",
    time: "",
    vehicleModel: "",
    vehicleNumber: "",
    paymentMethod: "prepaid",
  });

  /* =============================
     LOAD PACKAGES + ADDONS
  ============================== */
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [pkgRes, addonRes] = await Promise.all([
        axiosClient.get("/packages"),
        axiosClient.get("/addons"),
      ]);

      setPackages(Array.isArray(pkgRes.data) ? pkgRes.data : []);
      setAddons(Array.isArray(addonRes.data) ? addonRes.data : []);
    } catch (err) {
      setError("Failed to load booking data");
    } finally {
      setLoading(false);
    }
  }

  /* =============================
     PRICE CALCULATION
  ============================== */
  const getPackagePrice = () => {
    if (!form.packageId || !form.vehicleType) return 0;

    const selectedPackage = packages.find(
      (p) => p._id === form.packageId
    );

    if (!selectedPackage || !Array.isArray(selectedPackage.pricing)) return 0;

    const priceObj = selectedPackage.pricing.find(
      (p) => p.vehicleType === form.vehicleType
    );

    return priceObj ? priceObj.price : 0;
  };

  const calculateTotal = () => {
    let total = getPackagePrice();

    form.addOnIds.forEach((id) => {
      const addon = addons.find((a) => a._id === id);
      if (addon) total += Number(addon.basePrice || 0);
    });

    return total;
  };

  const convertToAMPM = (time24) => {
    if (!time24) return "";
    let [h, m] = time24.split(":");
    h = parseInt(h, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  /* =============================
     SUBMIT
  ============================== */
  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: { message: "Please login to book a service" },
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userId,
      packageId: form.packageId,
      addOnIds: form.addOnIds,
      location: form.location,
      date: form.date,
      time: convertToAMPM(form.time),
      vehicleType: form.vehicleType,
      vehicleModel: form.vehicleModel,
      vehicleNumber: form.vehicleNumber,
      bookingStatus: "pending",
      paymentMethod: form.paymentMethod,
    };

    try {
      await axiosClient.post("/bookings", payload);
      setShowThankYou(true);
      setTimeout(() => navigate("/profile"), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showThankYou) return <ThankYouComponent />;
  if (loading) return <Loader />;
  if (error) return <p className="error">{error}</p>;

  const selectedPackage = packages.find(p => p._id === form.packageId);

  return (
    <>
      {location.state?.message && (
        <p className="login-warning">{location.state.message}</p>
      )}

      <div className="booking-hero">
        <h1>Booking</h1>
      </div>

      <div className="booking-page">
        <form className="booking-form" onSubmit={handleSubmit}>
          <h1>Book A Service</h1>

          {/* RECEPTIONIST ONLY */}
          {isReceptionist && (
            <>
              <label>
                Customer Name
                <input
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
                  value={form.customerPhone}
                  onChange={(e) =>
                    setForm({ ...form, customerPhone: e.target.value })
                  }
                  required
                />
              </label>
            </>
          )}

          {/* PACKAGE */}
          <label>Main Package</label>
          <select
            value={form.packageId}
            onChange={(e) =>
              setForm({ ...form, packageId: e.target.value })
            }
            required
          >
            <option value="">Select Package</option>
            {packages.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.title}
              </option>
            ))}
          </select>

          {/* PACKAGE INCLUDES */}
          {selectedPackage?.includes?.length > 0 && (
            <ul className="package-includes">
              {selectedPackage.includes.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}

          {/* ADD ONS */}
          <label>Add-ons</label>
          <select
            multiple
            value={form.addOnIds}
            onChange={(e) =>
              setForm({
                ...form,
                addOnIds: Array.from(
                  e.target.selectedOptions,
                  (o) => o.value
                ),
              })
            }
          >
            {addons.map((addon) => (
              <option key={addon._id} value={addon._id}>
                {addon.title} – ₹{addon.basePrice}
              </option>
            ))}
          </select>

          {/* VEHICLE TYPE */}
          <label>
            Vehicle Type
            <select
              value={form.vehicleType}
              onChange={(e) =>
                setForm({ ...form, vehicleType: e.target.value })
              }
              required
            >
              <option value="">Select</option>
              <option value="hatchback">Hatchback</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
            </select>
          </label>

          <label>
            Location
            <input
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
              value={form.vehicleNumber}
              onChange={(e) =>
                setForm({ ...form, vehicleNumber: e.target.value })
              }
              required
            />
          </label>

          <p className="total-amount">
            Total Amount : ₹{calculateTotal()}
          </p>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "Create Booking"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Booking;
