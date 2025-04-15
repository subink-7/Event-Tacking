import React from "react";
import { Routes, Route } from "react-router-dom";
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
import Eventcard from "../Homepage/components/Eventcard";
import NewsFeed from "../News/NewsFeed";
import EventInfo from "../Homepage/EventInfo";
import SuperadminDashbaord from "../Superadmin/SuperadminDashbaord";

const Path = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Signup />} />
        
        {/* Protected Route for Dashboard */}
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
          
          {/* Modified route: Change from static to dynamic with ID parameter */}
          <Route path="/event/:id" element={<EventInfo/>}/>
          
          {/* Keep the old route for backward compatibility if needed */}
          <Route path="/eventinfo" element={<EventInfo/>}/>
        </Route>
      </Routes>
      <ToastContainer /> {/* Make sure ToastContainer is outside of Routes */}
    </>
  );
};

export default Path;