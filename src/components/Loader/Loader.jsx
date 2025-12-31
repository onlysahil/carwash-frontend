// src/components/Loader/Loader.jsx
import "./Loader.css";
import loaderImg from "../../assets/images/sticker.png";

function Loader() {
  return (
    <div className="loader-container">
      <div className="coin-flip">
        <img src={loaderImg} alt="Loading" />
      </div>
    </div>
  );
}

export default Loader;