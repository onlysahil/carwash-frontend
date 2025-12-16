// src/components/ServiceCard/ServiceCard.jsx
import "./ServiceCard.css";
import { useNavigate } from "react-router-dom";

function ServiceCard({ title, description, price, image }) {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate("/booking");
  };

  return (
    <div className="service-card">
      <img src={image} alt={title} className="service-img" />

      <h3 className="service-title">{title}</h3>
      <p className="service-desc">{description}</p>

      <div className="service-bottom">
        <span className="service-price">₹{price}</span>
        <button className="service-btn" onClick={handleBookClick}>
          Book
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;
