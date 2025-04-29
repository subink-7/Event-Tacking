import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../Authen/components/Register";
import Signup from "../Auth/components/LoginForm";
import EventsPage from "../Homepage/components/EventPage";
import AdminDashboard from "../Admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoutes";
import ProfilePage from "../utils/components/Profile";
import EventTracking from "../Tracking/EventTracking";
import CalendarPage from "../Tracking/Calendar";
import Notification from "../utils/components/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllEvents from "../utils/components/AllEvents";

import NewsFeed from "../News/NewsFeed";
import EventInfo from "../Homepage/EventInfo";
import SuperadminDashbaord from "../Superadmin/SuperadminDashbaord";


const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("accessToken");
  
  if (isAuthenticated) {
    // If user is logged in, redirect to dashboard
    const userRole = localStorage.getItem("role");
    if (userRole === "SUPERADMIN") {
      return <Navigate to="/superadmin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
};

const Path = () => {
  return (
    <>
      <Routes>

        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        
   
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<EventsPage />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tracking" element={<EventTracking />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/alleventpage" element={<AllEvents/>}/>
          <Route path="/newsfeed" element={<NewsFeed/>}/>
          <Route path="/superadmin" element={<SuperadminDashbaord/>}/>
          
         
          <Route path="/event/:id" element={<EventInfo/>}/>
          
         
          <Route path="/eventinfo" element={<EventInfo/>}/>
        </Route>
      </Routes>
      <ToastContainer /> 
    </>
  );
};

export default Path;