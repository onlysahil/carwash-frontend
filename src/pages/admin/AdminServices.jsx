import { useEffect, useState } from "react";
import axios from "../../api/axiosClient";
import "./AdminServices.css";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    durationMinutes: "",
    category: "interior",
    discountPercent: "",
    finalPrice: "",
    features: "",
    images: [],
    previewImages: []   // NEW
  });

  // Load all services
  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const res = await axios.get("/services");
      if (Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        console.error("Invalid response:", res.data);
        setServices([]);
      }
    } catch (err) {
      console.error("Fetch services error:", err);
    }
  }

  // Handle image upload
  function handleImageUpload(e) {
    const files = Array.from(e.target.files);

    setForm({
      ...form,
      images: files,  // store real files
      previewImages: files.map((file) => URL.createObjectURL(file)) // only for UI preview
    });
  }

  // Calculate final price automatically
  function calculateFinalPrice() {
    const priceNum = Number(form.price) || 0;
    const discountNum = Number(form.discountPercent) || 0;
    return Math.round(priceNum - (priceNum * discountNum) / 100);
  }

  // Add or Update Service
  async function handleSubmit(e) {
  e.preventDefault();

  const payload = {
    title: form.title,
    description: form.description,
    price: Number(form.price),
    durationMinutes: Number(form.durationMinutes),
    category: form.category,
    isActive: true,
    discountPercent: Number(form.discountPercent) || 0,
    finalPrice: calculateFinalPrice(),
    features: form.features
      ? form.features.split(",").map(f => f.trim())
      : [],
    images: form.images // will be array of strings
  };

  try {
    if (isEditing) {
      await axios.put(`/services/${editId}`, payload);
    } else {
      await axios.post("/services", payload);
    }

    resetForm();
    loadServices();
  } catch (err) {
    console.error(err);
    alert("Failed to save service");
  }
}

  function resetForm() {
    setForm({
      title: "",
      description: "",
      price: "",
      durationMinutes: "",
      category: "interior",
      discountPercent: "",
      finalPrice: "",
      features: "",
      images: [],
    });
    setIsEditing(false);
    setEditId(null);
  }

  async function deleteService(id) {
    try {
      await axios.delete(`/services/${id}`);
      loadServices();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

 function editService(service) {
  setIsEditing(true);
  setEditId(service._id);

  setForm({
    title: service.title,
    description: service.description,
    price: service.price,
    durationMinutes: service.durationMinutes,
    category: service.category,
    discountPercent: service.discountPercent || "",
    finalPrice: service.finalPrice || "",
    features: service.features?.join(", ") || "",
    images: service.images || [] // now array of URLs
  });
}
  return (

    <div className="admin-services-page">
      <h1>{isEditing ? "Edit Service" : "Add Service"}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Duration Minutes"
          value={form.durationMinutes}
          onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
          required
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="interior">Interior</option>
          <option value="exterior">Exterior</option>
        </select>

        <input
          type="number"
          placeholder="Discount %"
          value={form.discountPercent}
          onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
        />

        <input
          type="text"
          placeholder="Features (comma separated)"
          value={form.features}
          onChange={(e) => setForm({ ...form, features: e.target.value })}
        />

        <input
  type="text"
  placeholder="Image URLs (comma separated)"
  value={form.images.join(", ")}
  onChange={(e) =>
    setForm({ ...form, images: e.target.value.split(",").map(v => v.trim()) })
  }
/>
        <div className="image-preview">
  {form.images.map((img, idx) => (
    <img key={idx} src={img} alt="preview" />
  ))}
</div>

        <p>Final Price: ₹{calculateFinalPrice()}</p>

        <button className="admin-btn" type="submit">
          {isEditing ? "Update Service" : "Add Service"}
        </button>

        {isEditing && (
          <button className="admin-btn cancel" type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {/* <h2>All Services</h2> */}

      <table className="admin-table">
        <thead>
          <tr>
            {/* <th>Title</th> */}
            {/* <th>Price</th> */}
            {/* <th>Category</th> */}
            {/* <th>Images</th> */}
            {/* <th>Actions</th> */}
          </tr>
        </thead>

        <tbody>
          {services.map((s) => (
            <tr key={s._id}>
              <td>{s.title}</td>
              <td>₹{s.price}</td>
              <td>{s.category}</td>
              <td>
                {s.images?.slice(0, 2).map((img, i) => (
                  <img key={i} src={img} className="table-image" alt="" />
                ))}
              </td>
              <td>
                <button className="admin-btn edit" onClick={() => editService(s)}>Edit</button>
                <button className="admin-btn danger" onClick={() => deleteService(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminServices;
