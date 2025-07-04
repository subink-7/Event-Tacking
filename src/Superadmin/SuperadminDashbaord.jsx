import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaComments,
  FaPlus,
  FaSync
} from 'react-icons/fa';
import { useNavigate, useLocation } from "react-router-dom";
import UserPanel from './UserPanel';
import EventPanel from './EventPanel';
import PostsPanel from './PostsPanel';

const SuperadminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(""); 
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );
  
  
  const BASE_URL = "http://localhost:8000/";
  
  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("role");
    
    if (!accessToken) {
      
      navigate("/login", { replace: true });
      return;
    } 
    
    if (userRole !== "SUPERADMIN") {
     
      navigate("/login", { replace: true });
      return;
    }
    
    
    setUserRole(userRole);
    setIsLoggedIn(true);
    
   
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUserName(storedName);
    }
  }, [navigate]);
  
  
  useLayoutEffect(() => {
    document.title = "Superadmin Dashboard";
    
    
    const handleHistoryChange = () => {
      const userRole = localStorage.getItem("role");
      const isAuthenticated = !!localStorage.getItem("accessToken");
      
     
      if (location.pathname !== "/superadmin" && 
          isAuthenticated && 
          userRole === "SUPERADMIN") {
        navigate("/superadmin", { replace: true });
      } 
      else if (!isAuthenticated) {
        navigate("/login", { replace: true });
      }
      else if (userRole !== "SUPERADMIN") {
        navigate("/login", { replace: true });
      }
    };
    
 
    window.addEventListener('popstate', handleHistoryChange);
    
    
    handleHistoryChange();
    
    return () => {
      window.removeEventListener('popstate', handleHistoryChange);
    };
  }, [navigate, location]);
  
  
  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };
  
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;
      
      const response = await fetch(`${BASE_URL}api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };
  
  const fetchWithAuth = async (url, options = {}) => {
    const authHeader = getAuthHeader();
    const currentRole = localStorage.getItem("role");
    
    if (!authHeader) {
      throw new Error("Not authenticated - Please login again");
    }
    
    // Additional role verification
    if (currentRole !== "SUPERADMIN") {
      throw new Error("Unauthorized - Superadmin access required");
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...authHeader,
        },
      });
      
      if (response.status === 401) {
      
        const refreshed = await refreshToken();
        if (refreshed) {
         
          const roleAfterRefresh = localStorage.getItem("role");
          if (roleAfterRefresh !== "SUPERADMIN") {
            throw new Error("Unauthorized - Superadmin access required");
          }
          return fetchWithAuth(url, options);
        }
        throw new Error("Session expired. Please login again.");
      }
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  
  const fetchActiveTabData = async () => {
    setLoading(true);
    try {
    
      const currentRole = localStorage.getItem("role");
      if (currentRole !== "SUPERADMIN") {
        navigate("/", { replace: true });
        return;
      }
      
      let url = '';
      switch (activeTab) {
        case 'users':
          url = `${BASE_URL}users/api/customuser/`;
          break;
        case 'events':
          url = `${BASE_URL}events/`;
          break;
        case 'posts':
          url = `${BASE_URL}posts/feedback/`;
          break;
        default:
          url = `${BASE_URL}users/api/customuser/`;
      }
      
      const response = await fetchWithAuth(url);
      const data = await response.json();
      
      switch (activeTab) {
        case 'users':
          setUsers(data);
          break;
        case 'events':
          setEvents(data);
          break;
        case 'posts':
          setPosts(data);
          break;
        default:
          break;
      }
      setLoading(false);
    } catch (err) {
      if (err.message.includes("Session expired") || 
          err.message.includes("Not authenticated") ||
          err.message.includes("Unauthorized")) {
        handleLogout();
      }
      setError(err.message);
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (isLoggedIn && userRole === "SUPERADMIN") {
      fetchActiveTabData();
    }
  }, [activeTab, isLoggedIn, userRole]);
  
  
  const fetchSummaryData = async () => {
    try {
     
      const currentRole = localStorage.getItem("role");
      if (currentRole !== "SUPERADMIN") {
        navigate("/", { replace: true });
        return;
      }
      
     
      const usersResponse = await fetchWithAuth(`${BASE_URL}users/api/customuser/`);
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      
      const eventsResponse = await fetchWithAuth(`${BASE_URL}events/`);
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
      
   
      const postsResponse = await fetchWithAuth(`${BASE_URL}posts/feedback/`);
      const postsData = await postsResponse.json();
      setPosts(postsData);
    } catch (err) {
      console.error("Error fetching summary data:", err);
      if (err.message.includes("Session expired") || 
          err.message.includes("Not authenticated") ||
          err.message.includes("Unauthorized")) {
        handleLogout();
      }
    }
  };
  
 
  useEffect(() => {
    if (isLoggedIn && userRole === "SUPERADMIN") {
      fetchSummaryData();
    }
  }, [isLoggedIn, userRole]); 

 
  const handleLogout = () => {
    console.log("Logging out...");
 
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("userid");
    localStorage.removeItem("email");
    
    setUserName(""); 
    setUserRole("");
    setIsLoggedIn(false);
    

    navigate("/login", { replace: true });
  };


  const handleRefresh = () => {
   
    setLoading(true);
    fetchSummaryData();
    fetchActiveTabData();
  };

  // Render summary cards
  const renderSummaryCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Total Users</h3>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <FaUsers className="h-10 w-10 text-blue-500 opacity-80" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Total Events</h3>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
            <FaCalendarAlt className="h-10 w-10 text-green-500 opacity-80" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-800">Total Posts</h3>
              <p className="text-2xl font-bold">{posts.length}</p>
            </div>
            <FaComments className="h-10 w-10 text-purple-500 opacity-80" />
          </div>
        </div>
      </div>
    );
  };

 
  const renderActivePanel = () => {
    switch(activeTab) {
      case 'users':
        return <UserPanel
                users={users} 
                setUsers={setUsers} 
                loading={loading} 
                error={error} 
                fetchWithAuth={fetchWithAuth}
                BASE_URL={BASE_URL}
              />;
      case 'events':
        return <EventPanel
                events={events} 
                setEvents={setEvents} 
                loading={loading} 
                error={error} 
                fetchWithAuth={fetchWithAuth}
                BASE_URL={BASE_URL}
              />;
      case 'posts':
        return <PostsPanel
                posts={posts} 
                setPosts={setPosts} 
                users={users}
                events={events}
                loading={loading} 
                error={error}
                fetchWithAuth={fetchWithAuth}
                BASE_URL={BASE_URL}
              />;
      default:
        return <UserPanel
                users={users} 
                setUsers={setUsers} 
                loading={loading} 
                error={error} 
                fetchWithAuth={fetchWithAuth}
                BASE_URL={BASE_URL}
              />;
    }
  };


  if (!isLoggedIn || userRole !== "SUPERADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-slate-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-medium">Superadmin Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* <button 
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-slate-800 transition-colors flex items-center"
            onClick={handleRefresh}
          >
            <FaSync className="mr-2" /> Refresh
          </button> */}
          <span>Welcome, {userName || 'Admin'} </span>
          <button className="px-4 py-2 border border-white rounded hover:bg-white hover:text-slate-800 transition-colors"
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Sidebar */}
        <nav className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <ul>
            <li 
              className={`flex items-center space-x-3 px-4 py-3 cursor-pointer ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-slate-700'}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers className="h-5 w-5" />
              <span className="font-medium">Users</span>
            </li>
            <li 
              className={`flex items-center space-x-3 px-4 py-3 cursor-pointer ${activeTab === 'events' ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-slate-700'}`}
              onClick={() => setActiveTab('events')}
            >
              <FaCalendarAlt className="h-5 w-5" />
              <span className="font-medium">Events</span>
            </li>
            <li 
              className={`flex items-center space-x-3 px-4 py-3 cursor-pointer ${activeTab === 'posts' ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-slate-700'}`}
              onClick={() => setActiveTab('posts')}
            >
              <FaComments className="h-5 w-5" />
              <span className="font-medium">Posts</span>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="lg:col-span-10 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>

          {renderSummaryCards()}
          {renderActivePanel()}
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;