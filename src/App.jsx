import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from './Auth/components/LoginForm';
import EventsPage from './Homepage/components/EventPage';
import Register from './Authen/components/Register';
import AdminDashboard from './Admin/AdminDashboard';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Signup />} />
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<EventsPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
