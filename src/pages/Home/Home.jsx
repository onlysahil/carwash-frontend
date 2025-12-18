import "./Home.css";
import Testimonials from "../../components/Testimonial/Testimonials";

 
export default function Home() {
  return (
    <>
    <section className="hero">
      <div className="hero-left">
        <h1>
          Rapid <br /> Star Wash
        </h1>
        <p>
          Premium Car Wash & Professional Detailing Services — Fast, Safe &
          Delivered With Perfection.
        </p>
 
        <button className="primary-btn">Book Now</button>
      </div>
 
      <div className="hero-right">
        <img src="/images/red-car.png" alt="car" className="hero-car" />
      </div>
    </section>

    <section className="how">
      <h2 className="how-h2">How It Works</h2>
      <p className="how-p">Get Your Car Cleaned in Just a Few Easy Steps</p>
 
      <div className="steps">
        <div className="step">
          <div className="icon-circle1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#103B65" d="M3 21v-9l2.45-7h6.625q-.05.25-.062.488T12 6t.013.513t.062.487H6.85L5.8 10h7.725q.825.925 1.975 1.463T18 12H5v5h14v-5.1q.55-.1 1.05-.275t.95-.45V21h-3v-2H6v2zm14.325-11l-.275-1.175q-.275-.1-.537-.25t-.488-.35l-1.15.375l-.675-1.15l.875-.85q-.05-.3-.05-.6t.05-.6l-.875-.8l.675-1.15L16 3.775q.225-.2.488-.35t.562-.25L17.325 2h1.325l.3 1.15q.3.125.563.275t.487.35l1.125-.325l.675 1.15l-.85.8q.05.3.063.613t-.063.612l.85.8l-.65 1.15l-1.15-.35q-.225.2-.5.35t-.55.25L18.65 10zM18 7.5q.625 0 1.063-.437T19.5 6t-.437-1.062T18 4.5t-1.062.438T16.5 6t.438 1.063T18 7.5M5 12v5zm2.5 4q.625 0 1.063-.437T9 14.5t-.437-1.062T7.5 13t-1.062.438T6 14.5t.438 1.063T7.5 16m9 0q.625 0 1.063-.437T18 14.5t-.437-1.062T16.5 13t-1.062.438T15 14.5t.438 1.063T16.5 16"/></svg>
          </div>
          <p>Choose<br/>Your Service</p>
        </div>
 
        <div className="arrow">
          <svg width="180" height="20" viewBox="0 0 180 20" fill="none">
            <path d="M0 10H175M175 10L167 2M175 10L167 18" stroke="#585858" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
 
        <div className="step">
          <div className="icon-circle1">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#103B65" d="M21 11.11V5a2 2 0 0 0-2-2h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14a2 2 0 0 0 2 2h6.11c1.26 1.24 2.98 2 4.89 2c3.87 0 7-3.13 7-7c0-1.91-.76-3.63-2-4.89M12 3c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1M6 7h12v2H6zm3.08 10H6v-2h3.08c-.05.33-.08.66-.08 1s.03.67.08 1M6 13v-2h5.11c-.61.57-1.07 1.25-1.43 2zm10 8c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m.5-4.75l2.86 1.69l-.75 1.22L15 17v-5h1.5z"/></svg>
          </div>
          <p>Pick Date<br/>& Time</p>
        </div>
 
        <div className="arrow">
          <svg width="180" height="20" viewBox="0 0 180 20" fill="none">
            <path d="M0 10H175M175 10L167 2M175 10L167 18" stroke="#585858" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
 
        <div className="step">
          <div className="icon-circle1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14"><path fill="#103B65" fill-rule="evenodd" d="M3.5 4a2 2 0 1 0 0-4a2 2 0 0 0 0 4m2.045 6v-.03c0-.99.547-1.852 1.355-2.302A3.5 3.5 0 0 0 0 8.5v1a.5.5 0 0 0 .5.5h1l.445 3.562a.5.5 0 0 0 .496.438H4.56a.5.5 0 0 0 .496-.438L5.5 10zm4.382-2.313a.25.25 0 0 0-.25.25v.651h1.413v-.65a.25.25 0 0 0-.25-.25zm-1.75.25v.651c-.763 0-1.382.62-1.382 1.383v2.647c0 .763.619 1.382 1.382 1.382h4.412c.763 0 1.382-.619 1.382-1.382V9.97c0-.763-.618-1.382-1.381-1.382v-.65a1.75 1.75 0 0 0-1.75-1.75h-.913a1.75 1.75 0 0 0-1.75 1.75Z" clip-rule="evenodd"/></svg>
          </div>
          <p>Our Team<br/>Arrives</p>
        </div>
 
        <div className="arrow">
          <svg width="180" height="20" viewBox="0 0 180 20" fill="none">
            <path d="M0 10H175M175 10L167 2M175 10L167 18" stroke="#585858" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
 
        <div className="step">
          <div className="icon-circle1">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 640 640"><path fill="#103B65" d="M344 56c0-13.3-10.7-24-24-24s-24 10.7-24 24v64c0 13.3 10.7 24 24 24s24-10.7 24-24zM241.3 272h157.5c6.7 0 12.6 4.1 15 10.4l26.1 69.6H200.3l26.1-69.6c2.3-6.2 8.3-10.4 15-10.4zM130 356.8l-1.3 3.4C109.2 371.1 96 392 96 416v128c0 17.7 14.3 32 32 32h16c17.7 0 32-14.3 32-32v-32h288v32c0 17.7 14.3 32 32 32h16c17.7 0 32-14.3 32-32V416c0-24-13.2-44.9-32.8-55.9l-1.3-3.4l-36.3-96.9c-11.7-31.2-41.6-51.9-74.9-51.9H241.2c-33.3 0-63.2 20.7-74.9 51.9zm62 43.2c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32m224 32c0-17.7 14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32M103 71c-9.3 9.4-9.3 24.6 0 34l48 48c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6.1-34l-48-48c-9.4-9.3-24.6-9.3-34 0m400 0l-48 48c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l48-48c9.4-9.4 9.4-24.6 0-33.9s-24.5-9.3-33.9 0"/></svg>
          </div>
          <p>Enjoy a<br/>Spotless Ride</p>
        </div>
      </div>
      <br />
 
      <button className="primary-btn how-btn">Book Now</button>
    </section>
    <div className="border-bt1"></div>


  <Testimonials/>

     <section className="wwd">
      <img src="/images/clean.png" className="wwd-img" alt="work" />
 
      <div className="wwd-content">
        <h2>What We Do</h2>
        <p>
          Rapid Star Wash is your on-demand automobile care solution, offering premium cleaning and detailing services right at your doorstep. With fast response, expert technicians, and high-quality products, we ensure your vehicle looks spotless and refreshed every time. Convenience, perfection, and reliability, delivered to your home.
        </p>
 
        <button className="primary-btn">Know More</button>
      </div>
     
    </section>
     <div className="border-bt1"></div>
    </>
  );
}
