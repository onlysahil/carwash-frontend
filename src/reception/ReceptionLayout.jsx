import { Outlet } from "react-router-dom";
import ReceptionSidebar from "./ReceptionSidebar";
import ReceptionNavbar from "./ReceptionNavbar";
import "./reception.css";

export default function ReceptionLayout() {
  return (
    <div className="reception-layout">

      <ReceptionSidebar />

      <div className="reception-main">
        <ReceptionNavbar />

        <div className="reception-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
