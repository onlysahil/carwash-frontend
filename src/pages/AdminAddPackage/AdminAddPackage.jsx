import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import "./AdminAddPackage.css";

function AdminPackagesPage() {
    const [packages, setPackages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        services: [],
        price: 0,
        durationMinutes: 0,
        discountPercent: 0,
        images: [],
    });

    const [serviceInput, setServiceInput] = useState("");
    const [imageInput, setImageInput] = useState("");
    const [message, setMessage] = useState("");

    // Load packages
    async function loadPackages() {
        try {
            const res = await axiosClient.get("/packages");
            setPackages(res.data || []);
        } catch (err) {
            console.log("Failed to load packages", err);
        }
    }

    useEffect(() => {
        loadPackages();
    }, []);

    // Add service
    const addService = () => {
        if (!serviceInput.trim()) return;
        setForm((prev) => ({
            ...prev,
            services: [...prev.services, serviceInput.trim()],
        }));
        setServiceInput("");
    };

    const removeService = (s) => {
        setForm((prev) => ({
            ...prev,
            services: prev.services.filter((item) => item !== s),
        }));
    };

    // Add image
    const addImage = () => {
        if (!imageInput.trim()) return;
        setForm((prev) => ({
            ...prev,
            images: [...prev.images, imageInput.trim()],
        }));
        setImageInput("");
    };

    const removeImage = (img) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((item) => item !== img),
        }));
    };

    // RESET FORM
    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            services: [],
            price: 0,
            durationMinutes: 0,
            discountPercent: 0,
            images: [],
        });
        setIsEdit(false);
        setEditId(null);
        setShowForm(false);
    };

    // CREATE package
    const submitPackage = async (e) => {
        e.preventDefault();
        setMessage("");

        const payload = {
            title: form.title,
            description: form.description,
            services: form.services,
            price: Number(form.price),
            durationMinutes: Number(form.durationMinutes),
            discountPercent: Number(form.discountPercent),
            images: form.images,
        };

        try {
            if (!isEdit) {
                // CREATE
                await axiosClient.post("/packages", payload);
                setMessage("Package created successfully!");
            } else {
                // UPDATE
                await axiosClient.patch(`/packages/${editId}`, payload);
                setMessage("Package updated successfully!");
            }

            loadPackages();
            resetForm();
        } catch (err) {
            console.error(err);
            setMessage("Failed to save package");
        }
    };

    // LOAD DATA INTO FORM (Edit)
    const startEdit = (pkg) => {
        setIsEdit(true);
        setEditId(pkg._id);

        setForm({
            title: pkg.title,
            description: pkg.description,
            services: pkg.services || [],
            price: pkg.price,
            durationMinutes: pkg.durationMinutes,
            discountPercent: pkg.discountPercent,
            images: pkg.images || [],
        });

        setShowForm(true);
        setMessage("");
    };

    // DELETE
    const deletePackage = async (id) => {
        if (!window.confirm("Delete this package?")) return;

        try {
            await axiosClient.delete(`/packages/${id}`);
            loadPackages();
        } catch (err) {
            console.log("Delete failed", err);
        }
    };

    return (
        <div className="admin-add-package">

            {/* TOP BAR */}
            <div className="top-bar">
                <h2>Packages</h2>

                {!showForm && (
                    <button className="submit-btn" onClick={() => setShowForm(true)}>
                        Create New Package
                    </button>
                )}

                {showForm && (
                    <button className="submit-btn" onClick={resetForm}>
                        Close Form
                    </button>
                )}
            </div>

            {/* FORM */}
            {showForm && (
                <form className="pkg-form" onSubmit={submitPackage}>
                    {message && <div className="pkg-message">{message}</div>}

                    <label>Package Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                        required
                    />

                    <label>Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        required
                    />

                    <label>Price (₹)</label>
                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                        }
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

                    <label>Services</label>
                    <div className="row-input">
                        <input
                            type="text"
                            value={serviceInput}
                            onChange={(e) => setServiceInput(e.target.value)}
                        />
                        <button type="button" onClick={addService}>Add</button>
                    </div>
                    <div className="list-box">
                        {form.services.map((s, i) => (
                            <span className="tag" key={i}>
                                {s}
                                <button type="button" onClick={() => removeService(s)}>✕</button>
                            </span>
                        ))}
                    </div>

                    <label>Images</label>
                    <div className="row-input">
                        <input
                            type="text"
                            value={imageInput}
                            onChange={(e) => setImageInput(e.target.value)}
                        />
                        <button type="button" onClick={addImage}>Add</button>
                    </div>
                    <div className="list-box">
                        {form.images.map((img, i) => (
                            <span className="tag" key={i}>
                                {img}
                                <button type="button" onClick={() => removeImage(img)}>✕</button>
                            </span>
                        ))}
                    </div>

                    <button type="submit" className="submit-btn">
                        {isEdit ? "Update Package" : "Create Package"}
                    </button>
                </form>
            )}

            {/* PACKAGE LIST */}
            <div className="packages-list">
                {packages.length === 0 ? (
                    <p>No packages found</p>
                ) : (
                    packages.map((pkg) => (
                        <div className="package-card" key={pkg._id}>

                            {/* IMAGE PREVIEW */}
                            {pkg.images?.length > 0 && (
                                <img
                                    src={`https://dentiled-halley-asyndetically.ngrok-free.dev/uploads/settings/${pkg.images[0]}`}
                                    alt="package"
                                    className="pkg-image"
                                />
                            )}

                            <h3>{pkg.title}</h3>
                            <p>{pkg.description}</p>

                            <p><b>₹{pkg.price}</b></p>
                            <p>{pkg.durationMinutes} minutes</p>
                            <p>Discount: {pkg.discountPercent}%</p>

                            {/* SERVICES LIST */}
                            <div className="services-list">
                                <b>Services:</b>
                                <ul>
                                    {pkg.services?.length === 0 && <li>No services added</li>}

                                    {pkg.services?.map((service, i) => (
                                        <li key={i}>
                                            {typeof service === "string" ? (
                                                service
                                            ) : (
                                                // service object
                                                <>
                                                    <b>{service.title}</b> – ₹{service.price}
                                                    <br />
                                                    <small>{service.description}</small>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            {/* IMAGES LIST ALL */}
                            <div className="images-list">
                                <b>Images:</b>
                                {pkg.images?.map((img, i) => (
                                    <img
                                        key={i}
                                        src={`https://dentiled-halley-asyndetically.ngrok-free.dev/uploads/settings/${img}`}
                                        className="small-img"
                                        alt=""
                                    />
                                ))}
                            </div>

                            <div className="btn-row">
                                <button className="edit-btn" onClick={() => startEdit(pkg)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => deletePackage(pkg._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default AdminPackagesPage;
