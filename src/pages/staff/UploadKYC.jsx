import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import "./UploadKYC.css";

function UploadKYC() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    aadhaarNumber: "",
    panNumber: "",
    documentUrls: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 CHECK KYC STATUS ON LOAD
  useEffect(() => {
    const checkKycStatus = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const res = await axiosClient.get(`/users/${userId}`);
        const user = res.data;

        // ✅ DOCUMENTS ALREADY SUBMITTED → PENDING
        if (
          user.documentUrls &&
          user.documentUrls.length > 0 &&
          user.verificationStatus === "pending"
        ) {
          navigate("/staff/kyc-pending", { replace: true });
          return;
        }

        // ✅ APPROVED → DASHBOARD
        if (user.verificationStatus === "approved") {
          navigate(`/staff/profile/${user.role}`, { replace: true });
          return;
        }

        // ❌ REJECTED → ALLOW RE-UPLOAD (STAY HERE)
        // ❌ NO DOCUMENTS → ALLOW UPLOAD (STAY HERE)

      } catch (err) {
        console.error("KYC status check failed", err);
      }
    };

    checkKycStatus();
  }, [navigate]);

  // 📤 SUBMIT KYC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axiosClient.patch("/users/staff/upload-documents", form);

      // ⏳ AFTER SUBMIT → PENDING PAGE
      navigate("/staff/kyc-pending", { replace: true });
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
              documentUrls: e.target.value
                .split(",")
                .map((url) => url.trim())
                .filter(Boolean),
            })
          }
          required
        />

        <button disabled={loading}>
          {loading ? "Uploading..." : "Submit KYC"}
        </button>
      </form>
    </div>
  );
}

export default UploadKYC;