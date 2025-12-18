import { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

function UploadKYC() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    aadhaarNumber: "",
    panNumber: "",
    documentUrls: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axiosClient.patch("/users/staff/upload-documents", form);

      navigate("/staff/kyc-pending"); // optional status page
    } catch (err) {
      setError(err.response?.data?.message || "KYC upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kyc-container">
      <h2>Upload KYC Documents</h2>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Aadhaar Number</label>
        <input
          type="text"
          value={form.aadhaarNumber}
          onChange={(e) =>
            setForm({ ...form, aadhaarNumber: e.target.value })
          }
          required
        />

        <label>PAN Number</label>
        <input
          type="text"
          value={form.panNumber}
          onChange={(e) =>
            setForm({ ...form, panNumber: e.target.value })
          }
          required
        />

        <label>Document URLs</label>
        <input
          type="text"
          placeholder="Comma separated URLs"
          onChange={(e) =>
            setForm({
              ...form,
              documentUrls: e.target.value.split(","),
            })
          }
        />

        <button disabled={loading}>
          {loading ? "Uploading..." : "Submit KYC"}
        </button>
      </form>
    </div>
  );
}

export default UploadKYC;
