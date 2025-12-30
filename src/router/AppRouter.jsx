import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import Booking from "../pages/Booking/Booking";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Profile from "../pages/Profile/Profile";
import MyBookings from "../pages/MyBookings/MyBookings";
import NotFound from "../pages/NotFound/NotFound";
import Contact from "../pages/Contact/Contact";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";


import AdminBookings from "../pages/admin/AdminBookings";
import AdminServices from "../pages/admin/AdminServices";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersList from "../pages/admin/UsersList";
import AddStaff from "../pages/admin/AddStaff";
import StaffList from "../pages/admin/StaffList";

import UserEdit from "../pages/admin/UserEdit";
import UserView from "../pages/admin/UserView";
import StaffView from "../pages/admin/StaffView";
import StaffEdit from "../pages/admin/StaffEdit";
import AdminAddPackage from "../pages/AdminAddPackage/AdminAddPackage";
import ReceptionLayout from '../reception/ReceptionLayout';
import ReceptionStaffList from "../reception/ReceptionStaffList";

// import AdminApproval from "../pages/admin/AdminApproval";


import ReceptionUsersList from "../reception/ReceptionUsersList";
import ReceptionUserView from "../reception/ReceptionUserView";
import ReceptionPackages from "../reception/ReceptionPackages";
import ReceptionBooking from "../reception/ReceptionBooking";
import StaffProfile from "../pages/Profile/StaffProfile";


import ReceptionBookingApproval from "../reception/ReceptionBookingApproval";











import AdminRoute from "../routes/AdminRoute";
import AdminSettings from "../pages/admin/AdminSettings";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>


        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="staff" element={<StaffList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="add-staff" element={<AddStaff />} />
          <Route path="/admin/users/:id" element={<UserView />} />




          <Route path="/admin/users/:id/edit" element={<UserEdit />} />

          <Route path="/admin/staff/:id" element={<StaffView />} />
          <Route path="/admin/staff/:id/edit" element={<StaffEdit />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="/admin/add-package" element={<AdminAddPackage />} />
         
          {/* <Route path="approvals" element={<AdminApproval />} /> */}






        </Route>


        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/reception/*" element={<ReceptionLayout />}
        />




        <Route path="/reception/*" element={<ReceptionLayout />}>


          <Route path="users" element={<ReceptionUsersList />} />


          <Route path="users/:id" element={<ReceptionUserView />} />
          <Route path="users/:id/edit" element={<UserEdit />} />

          <Route path="staff" element={<ReceptionStaffList />} />


          <Route path="staff/:id" element={<UserView />} />
          <Route path="staff/:id/edit" element={<UserEdit />} />

          <Route path="packages" element={<ReceptionPackages />} />

          <Route path="bookings" element={<ReceptionBooking />} />

          <Route path="approvals" element={<ReceptionBookingApproval />} />







        </Route>


        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/staff/profile/:role" element={<StaffProfile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/users" element={<UsersList />} />
          





          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


        </Route>



        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;


