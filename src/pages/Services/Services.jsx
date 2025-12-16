import React, { useEffect, useState } from "react";
import servicesApi from "../../api/services";
import Loader from "../../components/Loader/Loader"
import './Services.css'
function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Base URL for images
const BASE_URL = process.env.REACT_APP_API_URL || "https://dentiled-halley-asyndetically.ngrok-free.dev";

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await servicesApi.getServices();
      console.log("Services API response:", res.data);

      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to fetch services.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

   if (loading) return <Loader />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <div className="services-page">
    <h1 className="services-title">Services List</h1>

    {services.length === 0 ? (
      <p className="services-empty">No services found</p>
    ) : (
      <div className="services-grid">
        {services.map((service) => (
          <div className="service-card" key={service._id}>
            
            <h3 className="service-title">{service.title}</h3>
            <p className="service-category">{service.category}</p>

            <p className="service-info">
              <span>Price:</span> ₹{service.price}
            </p>

            <p className="service-info">
              <span>Duration:</span> {service.durationMinutes} mins
            </p>

            <p className="service-features">
              <span>Features:</span> {service.features?.join(", ")}
            </p>

            {service.discountPercent > 0 && (
              <p className="service-discount">
                {service.discountPercent}% OFF
              </p>
            )}

            {service.images?.length > 0 && (
              <div className="service-images">
                {service.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.startsWith("http") ? img : `${BASE_URL}/${img}`}
                    alt={service.title}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default Services;
