import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import './ReceptionPackages.css'
import Loader from "../components/Loader/Loader";

function ReceptionPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPackages() {
    try {
      const res = await axiosClient.get("/packages");
      setPackages(res.data || []);
    } catch (err) {
      console.error("Failed to load packages", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPackages();
  }, []);

 if (loading) return <Loader />;

  return (
<div className="reception-packages">
  <h2>Available Packages</h2>
    
    <div className="packages-list">
      {packages.length === 0 ? (
        <p>No packages found</p>
      ) : (
        packages.map((pkg) => (
          <div className="package-card" key={pkg._id}>
            <h3>{pkg.title}</h3>
            <p>{pkg.description}</p>
            <p><b>₹{pkg.price}</b></p>
            <p>{pkg.durationMinutes} minutes</p>
          </div>
        ))
      )}
    </div>
    </div>
  );
}

export default ReceptionPackages;