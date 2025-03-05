import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

 import Signup from './Auth/components/LoginForm';


import EventsPage from './Homepage/components/EventPage';
import { Header } from './utils/components/Header';
import { Footer } from './utils/components/Footer';
import Register from './Authen/components/Register';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes without Header and Footer */}
        <Route path="/login" element={<Signup />} />
        <Route path="/" element={<Register />} />

        {/* Routes with Header and Footer */}
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route path="dashboard" element={<EventsPage/>} />
                
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

// Layout wrapper for routes with header and footer
function MainLayout({ children }) {
  return (
    <>
    <Header/>
      <main>{children}</main>
      <Footer/>
    </>
  );
}
