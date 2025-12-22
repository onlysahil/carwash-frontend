import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import "./KycPending.css";

function KycPending() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending"); 
  // pending | approved | rejected

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const checkStatus = async () => {
      try {
        const res = await axiosClient.get(`/users/${userId}`);

        const verificationStatus = res.data.verificationStatus;

        if (verificationStatus === "approved") {
          setStatus("approved");
        } else if (verificationStatus === "rejected") {
          setStatus("rejected");
        } else {
          setStatus("pending");
        }
      } catch (err) {
        console.error("KYC status check failed", err);
      }
    };

    // ✅ initial check
    checkStatus();

    // 🔄 poll every 6 seconds
    const interval = setInterval(checkStatus, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="kyc-pending-container">
      {status === "approved" && (
        <>
          <h2 className="approved-title">KYC Approved 🎉</h2>
          <p>Your documents have been verified successfully.</p>
          <p>You may now continue using the application.</p>

          <button
            className="approved-btn"
            onClick={() => navigate("/login")}
          >
            Continue
          </button>
        </>
      )}

      {status === "pending" && (
        <>
          <h2>KYC Under Review</h2>
          <p>
            Your KYC documents have been submitted successfully.
            <br />
            Please wait for admin approval.
          </p>
          <p>You will be notified once your KYC is approved.</p>
        </>
      )}

      {status === "rejected" && (
        <>
          <h2 className="rejected-title">KYC Rejected ❌</h2>
          <p>Your documents were rejected by admin.</p>
          <p>Please upload correct documents again.</p>

          <button
            className="retry-btn"
            onClick={() => navigate("/staff/upload-kyc")}
          >
            Re-upload KYC
          </button>
        </>
      )}
    </div>
  );
}

export default KycPending;