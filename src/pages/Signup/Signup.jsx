import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");

  // ---------------------- INPUT CHANGE ----------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: null });
  };

  // ---------------------- FRONTEND VALIDATION ----------------------
  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Invalid email format.";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone must be exactly 10 digits.";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // ---------------------- SUBMIT HANDLER ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Run Validation First
    if (!validate()) return;

    setLoading(true);

    try {
      await register(formData);

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
      });

      setMessage("User registered successfully! Redirecting...");

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      const data = err.response?.data;
      const newErrors = {};

      if (data) {
        if (typeof data.message === "string") {
          setMessage(data.message);
        }

        Object.keys(data).forEach((field) => {
          if (typeof data[field] === "string") {
            newErrors[field] = data[field];
          } else if (Array.isArray(data[field])) {
            newErrors[field] = data[field].join(" ");
          }
        });
      } else {
        setMessage("Registration failed. Please try again.");
      }

      setFieldErrors(newErrors);

    } finally {
      setLoading(false);
    }
  };

  // ---------------------- UI ----------------------
  return (
    <>
      <div className="signup-container">
        <h1>Create Account</h1>

        <form className="signup-form" onSubmit={handleSubmit}>

          {/* Name */}
          <label>Username</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          {fieldErrors.name && <p className="error-msg">{fieldErrors.name}</p>}

          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="yourmail@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {fieldErrors.email && <p className="error-msg">{fieldErrors.email}</p>}

          {/* Password */}
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
          />
          {fieldErrors.password && <p className="error-msg">{fieldErrors.password}</p>}

          {/* Phone */}
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            maxLength="10"
            placeholder="10-digit phone number"
            value={formData.phone}
            onChange={handleChange}
          />
          {fieldErrors.phone && <p className="error-msg">{fieldErrors.phone}</p>}

          {/* Address */}
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
          />
          {fieldErrors.address && <p className="error-msg">{fieldErrors.address}</p>}

          {/* Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Success Message */}
          {message && message.includes("successfully") && (
            <p className="signup-success">{message}</p>
          )}

          {/* Link to Login */}
          <div className="auth-switch">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;
