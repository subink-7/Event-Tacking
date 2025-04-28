import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return data.access;
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userid');
      toast.error('Session expired. Please log in again.', {
        onClick: handleLogout
      });
      return null;
    }
  };

  // API request with token refresh capability
  const apiRequestWithTokenRefresh = async (url, options = {}) => {
    // First attempt with current access token
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      };
    }

    let response = await fetch(url, options);
    
    // If token expired, try to refresh and retry the request
    if (response.status === 401) {
      const tokenData = await response.json();
      if (tokenData.code === 'token_not_valid') {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry request with new token
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`
          };
          return fetch(url, options);
        }
      }
    }
    
    return response;
  };

  // Fetch user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userid');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      setError('User ID not found. Please log in.');
      toast.error('User ID not found. Please log in.', {
        onClick: handleLogout
      });
      setLoading(false);
    }
  }, []);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await apiRequestWithTokenRefresh(`http://localhost:8000/users/api/customuser/${userId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();

        // Update form data with API response
        setFormData({
          name: data.name ?? 'N/A',
          email: data.email ?? 'N/A',
          phoneNumber: data.phonenumber ?? 'N/A', 
          address: data.address ?? 'N/A',
        });
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequestWithTokenRefresh('http://localhost:8000/users/api/update-profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phonenumber: formData.phoneNumber,
          address: formData.address,
        }),
      });

      if (response.ok) {
        // Refetch the user data after update
        const userResponse = await apiRequestWithTokenRefresh(`http://localhost:8000/users/api/customuser/${userId}/`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setFormData({
            name: userData.name ?? 'N/A',
            email: userData.email ?? 'N/A',
            phoneNumber: userData.phonenumber ?? 'N/A',
            address: userData.address ?? 'N/A',
          });
        }
        
        // Show success toast
        toast.success('Profile updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        
        setEditMode(false);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to update profile.';
        setError(errorMessage);
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout when session cannot be refreshed
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userid');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full bg-white/90 backdrop-blur-md shadow-md">
        <Header />
      </div>

      <main className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-xl">
          <div className="border-b border-gray-100 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <p className="text-blue-100">Manage your account information</p>
          </div>

          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-500">Loading your profile...</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Profile Avatar */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-700">Personal Information</h3>
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center shadow"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* View Mode Fields with Icons */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-600">Name</h3>
                        <p className="text-gray-800">{formData.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-600">Email</h3>
                        <p className="text-gray-800">{formData.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-600">Phone Number</h3>
                        <p className="text-gray-800">{formData.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-semibold text-gray-600">Address</h3>
                        <p className="text-gray-800">{formData.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}