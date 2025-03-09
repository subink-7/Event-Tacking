import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../Authen/components/Register";
import Signup from "../Auth/components/LoginForm";
import EventsPage from "../Homepage/components/EventPage";
import AdminDashboard from "../Admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoutes";
import ProfilePage from "../utils/components/Profile";


const Path = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Signup/>} />

      {/* Protected Route for Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<EventsPage/>} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
     <Route path="/profile" element={<ProfilePage/>}/>
      </Route>
    </Routes>
  );
};

export default Path;
