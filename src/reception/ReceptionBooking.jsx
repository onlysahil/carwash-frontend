// import { useEffect, useState } from "react";
// import axiosClient from "../api/axiosClient";
// import Loader from "../components/Loader/Loader";


// function ReceptionBooking() {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const receptionistId = localStorage.getItem("user_id");

//   const [form, setForm] = useState({
//     customerName: "",
//     customerEmail: "",
//     customerPhone: "",
//     customerPassword: "",
//     serviceIds: [],
//     location: "",
//     date: "",
//     time: "",
//     vehicleModel: "",
//     vehicleNumber: "",
//   });

//   useEffect(() => {
//     loadServices();
//   }, []);

//   async function loadServices() {
//     try {
//       const res = await axiosClient.get("/services");
//       setServices(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load services");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const calculateTotal = () =>
//     form.serviceIds.reduce((sum, id) => {
//       const s = services.find((srv) => srv._id === id);
//       return s ? sum + s.price : sum;
//     }, 0);

//   const getMinTime = () => {
//     const today = new Date().toISOString().split("T")[0];
//     if (form.date !== today) return "00:00";
//     const now = new Date();
//     return `${now.getHours().toString().padStart(2, "0")}:${now
//       .getMinutes()
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const convertToAMPM = (time24) => {
//     if (!time24) return "";
//     let [hour, minute] = time24.split(":");
//     hour = parseInt(hour, 10);
//     const ampm = hour >= 12 ? "PM" : "AM";
//     hour = hour % 12 || 12;
//     return `${hour}:${minute} ${ampm}`;
//   };

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const payload = {
//       customerName: form.customerName,
//       customerEmail: form.customerEmail,
//       customerPhone: form.customerPhone,
//       customerPassword: form.customerPassword,
//       serviceIds: form.serviceIds,
//       location: form.location,
//       date: form.date,
//       time: convertToAMPM(form.time),
//       vehicleModel: form.vehicleModel,
//       vehicleNumber: form.vehicleNumber,
//       status: "pending",
//       createdBy: receptionistId, 
//     };

//     try {
//       await axiosClient.post("/bookings", payload);
//       alert("Booking created successfully!");

//       setForm({
//         customerName: "",
//         customerEmail: "",
//         customerPhone: "",
//         customerPassword: "",
//         serviceIds: [],
//         location: "",
//         date: "",
//         time: "",
//         vehicleModel: "",
//         vehicleNumber: "",
//       });
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Booking failed");
//     }
//   }

//   if (loading) return <Loader />;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className="booking-page">
//       <h1>Reception – Create Booking</h1>

//       <form className="booking-form" onSubmit={handleSubmit}>
       
//         <label>
//           Customer Name
//           <input
//             type="text"
//             value={form.customerName}
//             onChange={(e) =>
//               setForm({ ...form, customerName: e.target.value })
//             }
//             required
//           />
//         </label>

//         <label>
//           Customer Email
//           <input
//             type="email"
//             value={form.customerEmail}
//             onChange={(e) =>
//               setForm({ ...form, customerEmail: e.target.value })
//             }
//             required
//           />
//         </label>

//         <label>
//           Customer Phone
//           <input
//             type="tel"
//             value={form.customerPhone}
//             onChange={(e) =>
//               setForm({ ...form, customerPhone: e.target.value })
//             }
//             required
//           />
//         </label>

//         <label>
//           Customer Password
//           <input
//             type="password"
//             value={form.customerPassword}
//             onChange={(e) =>
//               setForm({ ...form, customerPassword: e.target.value })
//             }
//             required
//           />
//         </label>

       
//         <label>
//           Services
//           <select
//             multiple
//             value={form.serviceIds}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 serviceIds: [...e.target.selectedOptions].map(
//                   (o) => o.value
//                 ),
//               })
//             }
//             required
//           >
//             {services.map((srv) => (
//               <option key={srv._id} value={srv._id}>
//                 {srv.title} — ₹{srv.price}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label>
//           Location
//           <input
//             type="text"
//             value={form.location}
//             onChange={(e) =>
//               setForm({ ...form, location: e.target.value })
//             }
//             required
//           />
//         </label>

//         <label>
//           Date
//           <input
//             type="date"
//             min={new Date().toISOString().split("T")[0]}
//             value={form.date}
//             onChange={(e) =>
//               setForm({ ...form, date: e.target.value, time: "" })
//             }
//             required
//           />
//         </label>

//         <label>
//           Time
//           <input
//             type="time"
//             min={form.date ? getMinTime() : "00:00"}
//             value={form.time}
//             onChange={(e) =>
//               setForm({ ...form, time: e.target.value })
//             }
//             required
//           />
//         </label>

//         <label>
//           Vehicle Model
//           <input
//             type="text"
//             value={form.vehicleModel}
//             onChange={(e) =>
//               setForm({ ...form, vehicleModel: e.target.value })
//             }
//             required
//           />
//         </label>

//         <label>
//           Vehicle Number
//           <input
//             type="text"
//             value={form.vehicleNumber}
//             onChange={(e) =>
//               setForm({ ...form, vehicleNumber: e.target.value })
//             }
//             required
//           />
//         </label>

//         <p>
//           <strong>Total Amount: ₹{calculateTotal()}</strong>
//         </p>

//         <button type="submit">Create Booking</button>
//       </form>
//     </div>
//   );
// }

// export default ReceptionBooking;



import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Loader from "../components/Loader/Loader";

function ReceptionBooking() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const receptionistId = localStorage.getItem("user_id");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerPassword: "",
    serviceIds: [],
    location: "",
    date: "",
    time: "",
    vehicleModel: "",
    vehicleNumber: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const res = await axiosClient.get("/services");
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  const calculateTotal = () =>
    form.serviceIds.reduce((sum, id) => {
      const s = services.find((srv) => srv._id === id);
      return s ? sum + s.price : sum;
    }, 0);

  const getMinTime = () => {
    const today = new Date().toISOString().split("T")[0];
    if (form.date !== today) return "00:00";
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const convertToAMPM = (time24) => {
    if (!time24) return "";
    let [hour, minute] = time24.split(":");
    hour = parseInt(hour, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    // ✅ Auto-generate password if empty
    const password =
      form.customerPassword || Math.random().toString(36).slice(-8);

    const payload = {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      customerPassword: password,
      serviceIds: form.serviceIds,
      location: form.location,
      date: form.date,
      time: convertToAMPM(form.time),
      vehicleModel: form.vehicleModel,
      vehicleNumber: form.vehicleNumber,
      status: "pending",

      // 🔑 IMPORTANT
      createdBy: receptionistId,
      createdByRole: "reception",
    };

    try {
      await axiosClient.post("/bookings", payload);
      alert("Booking created successfully!");

      setForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerPassword: "",
        serviceIds: [],
        location: "",
        date: "",
        time: "",
        vehicleModel: "",
        vehicleNumber: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    }
  }

  if (loading) return <Loader />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="booking-page">
      <h1>Reception – Create Booking</h1>

      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          Customer Name
          <input
            type="text"
            value={form.customerName}
            onChange={(e) =>
              setForm({ ...form, customerName: e.target.value })
            }
            required
          />
        </label>

        <label>
          Customer Email
          <input
            type="email"
            value={form.customerEmail}
            onChange={(e) =>
              setForm({ ...form, customerEmail: e.target.value })
            }
            required
          />
        </label>

        <label>
          Customer Phone
          <input
            type="tel"
            value={form.customerPhone}
            onChange={(e) =>
              setForm({ ...form, customerPhone: e.target.value })
            }
            required
          />
        </label>

        <label>
          Customer Password (optional)
          <input
            type="password"
            value={form.customerPassword}
            onChange={(e) =>
              setForm({ ...form, customerPassword: e.target.value })
            }
          />
        </label>

        <label>
          Services
          <select
            multiple
            value={form.serviceIds}
            onChange={(e) =>
              setForm({
                ...form,
                serviceIds: [...e.target.selectedOptions].map(
                  (o) => o.value
                ),
              })
            }
            required
          >
            {services.map((srv) => (
              <option key={srv._id} value={srv._id}>
                {srv.title} — ₹{srv.price}
              </option>
            ))}
          </select>
        </label>

        <label>
          Location
          <input
            type="text"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            required
          />
        </label>

        <label>
          Date
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value, time: "" })
            }
            required
          />
        </label>

        <label>
          Time
          <input
            type="time"
            min={form.date ? getMinTime() : "00:00"}
            value={form.time}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
            required
          />
        </label>

        <label>
          Vehicle Model
          <input
            type="text"
            value={form.vehicleModel}
            onChange={(e) =>
              setForm({ ...form, vehicleModel: e.target.value })
            }
            required
          />
        </label>

        <label>
          Vehicle Number
          <input
            type="text"
            value={form.vehicleNumber}
            onChange={(e) =>
              setForm({ ...form, vehicleNumber: e.target.value })
            }
            required
          />
        </label>

        <p>
          <strong>Total Amount: ₹{calculateTotal()}</strong>
        </p>

        <button type="submit">Create Booking</button>
      </form>
    </div>
  );
}

export default ReceptionBooking;
