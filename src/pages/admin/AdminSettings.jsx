import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import Loader from "../../components/Loader/Loader"
import "./AdminSettings.css";

function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    holidays: [],
    workingHours: {},
  });

  const [logoFile, setLogoFile] = useState(null);

  // Load Settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await axiosClient.get("/settings");
      setSettings(res.data);

      setForm({
        businessName: res.data.businessName || "",
        logo: res.data.logo || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        holidays: res.data.holidays || [],
        workingHours: res.data.workingHours || {},
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // Upload Logo
  const uploadLogo = async () => {
    if (!logoFile) {
      alert("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("logo", logoFile);

      const res = await axiosClient.post("/settings/upload-logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Logo uploaded successfully!");
      setForm({ ...form, logo: res.data.logo });

      loadSettings();
    } catch (err) {
      console.error(err);
      setMessage("Logo upload failed");
    }
  };

  // Update Settings
  const updateSettings = async (e) => {
    e.preventDefault();

    try {
      await axiosClient.patch("/settings", form, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("Settings updated successfully!");
      setEditMode(false);
      loadSettings();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update settings");
    }
  };

  // Add Holiday
  function addHoliday(date) {
    if (!date) return;
    setForm({ ...form, holidays: [...form.holidays, date] });
  }

  // Remove Holiday
  function removeHoliday(date) {
    setForm({
      ...form,
      holidays: form.holidays.filter((h) => h !== date),
    });
  }

  // Update Working Hours
  function updateWorkingHour(day, field, value) {
    setForm({
      ...form,
      workingHours: {
        ...form.workingHours,
        [day]: {
          ...form.workingHours[day],
          [field]: value,
        },
      },
    });
  }

   if (loading) return <Loader />;

  return (
    <div className="admin-settings">
      <h2>Business Settings</h2>

      {message && <div className="settings-message">{message}</div>}

      {!editMode ? (
        <div className="settings-card">

          {/* LOGO PREVIEW */}
          {settings.logo && (
            <img
              src={`https://dentiled-halley-asyndetically.ngrok-free.dev/uploads/${settings.logo}`}
              alt="Business Logo"
              className="settings-logo-preview"
            />
          )}

          <p><b>Business Name:</b> {settings.businessName}</p>
          <p><b>Email:</b> {settings.email}</p>
          <p><b>Phone:</b> {settings.phone}</p>
          <p><b>Address:</b> {settings.address}</p>

          <h4>Holidays:</h4>
          <ul>
            {settings.holidays.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>

          <h4>Working Hours:</h4>
          {Object.keys(settings.workingHours).map((day) => (
            <p key={day}>
              <b>{day.toUpperCase()}</b> — {settings.workingHours[day].open} to {settings.workingHours[day].close}
            </p>
          ))}

          <button className="primary-btn" onClick={() => setEditMode(true)}>
            Edit Settings
          </button>
        </div>
      ) : (
        <form className="settings-card" onSubmit={updateSettings}>

          {/* LOGO UPLOAD SECTION */}
          <h3>Logo</h3>

          {form.logo && (
            <img
              src={`https://dentiled-halley-asyndetically.ngrok-free.dev/uploads/${form.logo}`}
              alt="Logo"
              className="settings-logo-preview"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
          />

          <button type="button" className="upload-btn" onClick={uploadLogo}>
            Upload Logo
          </button>

          <hr />

          <label>Business Name:</label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) =>
              setForm({ ...form, businessName: e.target.value })
            }
          />

          <label>Email:</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Phone:</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label>Address:</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <h4>Holidays</h4>
          <div className="holiday-list">
            {form.holidays.map((h, i) => (
              <div key={i} className="holiday-item">
                {h}
                <button type="button" onClick={() => removeHoliday(h)}>✕</button>
              </div>
            ))}
          </div>

          <input type="date" onChange={(e) => addHoliday(e.target.value)} />

          <h4>Working Hours</h4>
          {Object.keys(form.workingHours).map((day) => (
            <div key={day} className="working-row">
              <b>{day.toUpperCase()}</b>
              <input
                type="time"
                value={form.workingHours[day].open}
                onChange={(e) =>
                  updateWorkingHour(day, "open", e.target.value)
                }
              />
              <input
                type="time"
                value={form.workingHours[day].close}
                onChange={(e) =>
                  updateWorkingHour(day, "close", e.target.value)
                }
              />
            </div>
          ))}

          <button className="primary-btn" type="submit">
            Save Changes
          </button>
          <button
            className="cancel-btn"
            type="button"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminSettings;
