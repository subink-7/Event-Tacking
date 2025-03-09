import React, { useState, useEffect } from 'react';
import { Header } from './Header';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const [userId, setUserId] = useState(null); // Store user ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user ID from storage or authentication system
  useEffect(() => {
    const storedUserId = localStorage.getItem('userid'); // Example: Getting from localStorage
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User ID not found. Please log in.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return; // Don't fetch if no userId

      try {
        const response = await fetch(`http://localhost:8000/users/api/customuser/${userId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        
        console.log('User Data:', data);

        // Update form data with API response
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phone_number || '', // Assuming phone_number field
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="relative z-10 w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <Header />
      </div>

      <main className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-700">Profile Information</h2>

          {/* Show loading or error */}
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Display user information */}
          {!loading && !error && formData.name && (
            <div className="mt-6 space-y-4">
              {/* Name */}
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold text-gray-600">Name</h3>
                <p className="text-gray-700">{formData.name}</p>
              </div>

              {/* Email */}
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold text-gray-600">Email</h3>
                <p className="text-gray-700">{formData.email}</p>
              </div>

              {/* Phone Number */}
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold text-gray-600">Phone Number</h3>
                <p className="text-gray-700">{formData.phoneNumber}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
