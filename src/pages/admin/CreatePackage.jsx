import { useState } from "react";
import axios from "axios";

const API_URL = "https://dentiled-halley-asyndetically.ngrok-free.dev";

function CreatePackage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    durationMinutes: "",
    discountPercent: "",
    services: [],
    images: [],
  });

  const [serviceInput, setServiceInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/packages`,
        {
          ...form,
          price: Number(form.price),
          durationMinutes: Number(form.durationMinutes),
          discountPercent: Number(form.discountPercent),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Package created successfully!");
      console.log("Success:", res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error creating package (check token & inputs)");
    }
  };

  return (
    <div style={{ width: "500px", margin: "30px auto" }}>
      <h2>Create New Package</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <label>Price</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <label>Duration (Minutes)</label>
        <input
          type="number"
          value={form.durationMinutes}
          onChange={(e) =>
            setForm({ ...form, durationMinutes: e.target.value })
          }
        />

        <label>Discount (%)</label>
        <input
          type="number"
          value={form.discountPercent}
          onChange={(e) =>
            setForm({ ...form, discountPercent: e.target.value })
          }
        />

        <div style={{ marginTop: "15px" }}>
          <label>Add Service</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={serviceInput}
              onChange={(e) => setServiceInput(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (serviceInput.trim() !== "") {
                  setForm({
                    ...form,
                    services: [...form.services, serviceInput.trim()],
                  });
                  setServiceInput("");
                }
              }}
            >
              Add
            </button>
          </div>

          <ul>
            {form.services.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: "15px" }}>
          <label>Add Image URL</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                if (imageInput.trim() !== "") {
                  setForm({
                    ...form,
                    images: [...form.images, imageInput.trim()],
                  });
                  setImageInput("");
                }
              }}
            >
              Add
            </button>
          </div>

          <ul>
            {form.images.map((img, i) => (
              <li key={i}>{img}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          style={{ marginTop: "20px", padding: "10px 20px" }}
        >
          Create Package
        </button>
      </form>
    </div>
  );
}

export default CreatePackage;
