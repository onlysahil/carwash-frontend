import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import ServiceCard from "../../components/ServiceCard/ServiceCard";

import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="home-hero" data-aos="fade-down">
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src={require("../../assets/images/background.mp4")} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1>Premium Car Washing Service</h1>
        <p>Quality wash, doorstep service, and hassle-free booking.</p>
        <Link to="/booking" className="home-btn">Book Now</Link>
      </section>


      {/* Services Preview */}
      <section className="home-services-preview" data-aos="fade-up">
        <h2>Popular Services</h2>
        <div className="home-service-grid">
          <ServiceCard
            title="Exterior Wash"
            description="Shine and clean exterior wash."
            price="299"
            image="/images/img1.jpg"
          />
          <ServiceCard
            title="Interior Cleaning"
            description="Deep cleaning for interiors."
            price="499"
            image="/images/img2.webp"
          />
          <ServiceCard
            title="Full Detailing"
            description="Premium cleaning inside out."
            price="999"
            image="/images/img3.jpg"
          />
        </div>
      </section>







      <section className="mm-hero">

        <div className="mm-hero-overlay"></div>

        <div className="mm-hero-content" data-aos="fade-up">
          <h1 className="mm-hero-title">
            Drive Clean. <span>Look Sharp.</span>
          </h1>

          <p className="mm-hero-subtitle">
            Premium car wash & detailing with a modern, minimal touch.
          </p>

          <div className="mm-hero-buttons">
            <Link to="/services" className="mm-btn-primary">Explore Services</Link>
            <Link to="/booking" className="mm-btn-secondary">Book Appointment</Link>
          </div>
        </div>

      </section>





    </div>
  );
}

export default Home;
