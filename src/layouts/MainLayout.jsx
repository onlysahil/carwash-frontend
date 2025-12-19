// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function MainLayout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "140vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
