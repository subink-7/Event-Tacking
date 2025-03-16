import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });
  
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userid');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      setError('User ID not found. Please log in.');
      setLoading(false);
    }
  }, []);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:8000/users/api/customuser/${userId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();

        // Update form data with API response
        setFormData({
          name: data.name ?? 'N/A',
          email: data.email ?? 'N/A',
          phoneNumber: data.phonenumber ?? 'N/A',
        });
      } catch (err) {
        setError(err.message);
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
    setUpdateSuccess(false);

    try {
      const response = await fetch('http://localhost:8000/users/api/update-profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

        },
        body: JSON.stringify({
          userId: userId,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setUpdateSuccess(true);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 font-sans">
      {/* Enhanced header with shadow and blur */}
      <div className="sticky top-0 z-10 w-full bg-white/90 backdrop-blur-md shadow-md">
        <Header />
      </div>

      <main className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Notification for success or error */}
        {updateSuccess && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 p-4 rounded-md text-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Profile updated successfully!
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded-md text-red-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

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
              {/* Profile picture with improved icon */}
              <div className="flex justify-center mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-blue-600">
                      <path d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653z" />
                      <path d="M12 12.75c-1.648 0-3-1.352-3-3V8.25h6v1.5c0 1.648-1.352 3-3 3z" />
                      <path d="M16.5 6.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                  </div>
                  {editMode && (
                    <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

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
                  <div className="transition-all duration-200 hover:shadow-md rounded-lg">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    />
                  </div>
                  
                  <div className="transition-all duration-200 hover:shadow-md rounded-lg">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      required
                    />
                  </div>
                  
                  <div className="transition-all duration-200 hover:shadow-md rounded-lg">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center shadow"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-sm font-semibold text-gray-600">Name</h3>
                    </div>
                    <p className="text-gray-800 pl-7">{formData.name}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <h3 className="text-sm font-semibold text-gray-600">Email</h3>
                    </div>
                    <p className="text-gray-800 pl-7">{formData.email}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <h3 className="text-sm font-semibold text-gray-600">Phone Number</h3>
                    </div>
                    <p className="text-gray-800 pl-7">{formData.phoneNumber}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
       
      </main>

      {/* Footer */}
      <div className="relative z-10 mt-auto">
             <Footer/>
           </div>
    </div>
  );
}