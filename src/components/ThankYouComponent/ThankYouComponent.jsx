import React from "react";
import "./ThankYouComponent.css";

export default function ThankYouComponent() {
  return (
    <div className="thank-you-overlay">
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
            <path fill="black" d="m23 12l-2.44-2.78l.34-3.68l-3.61-.82l-1.89-3.18L12 3L8.6 1.54L6.71 4.72l-3.61.81l.34 3.68L1 12l2.44 2.78l-.34 3.69l3.61.82l1.89 3.18L12 21l3.4 1.46l1.89-3.18l3.61-.82l-.34-3.68zm-13 5l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9z"/>
          </svg>
          <h1 className="main-heading">Thank You!</h1>
        </div>

        <h2 className="subheading">Your Booking Is Confirmed</h2>

        <p className="description">
          Thank you for choosing <span className="company-name">Rapid Star Wash</span>.
          Your car wash has been successfully booked.
        </p>
      </div>
    </div>
    </div>
  );
}
