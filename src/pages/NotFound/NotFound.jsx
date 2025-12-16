// src/pages/NotFound/NotFound.jsx
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <p>Oops, this page does not exist.</p>
      <Link to="/" className="notfound-btn">Go Home</Link>
    </div>
  );
}

export default NotFound;
