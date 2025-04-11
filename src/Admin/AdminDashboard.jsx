"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CalendarIcon, Clock, MapPin, FileText, Info, LogOut, Bell } from "lucide-react"

export default function AdminDashboard() {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    starting_point: "",
    route: "",
    description: "",
    image: null,
    send_notifications: true, // New field for notification toggle
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: null })
  const [error, setError] = useState("")
  const [eventImageUrl, setEventImageUrl] = useState("")
  const [userName, setUserName] = useState("")
  const navigate = useNavigate()

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      // If no tokens, redirect to login
      if (!(accessToken || refreshToken)) {
        navigate("/");
      }
      
      // Set user name
      const storedUser = localStorage.getItem("name");
      if (storedUser) {
        setUserName(storedUser);
      }
    };
    
    checkAuthStatus();
    
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [navigate]);

  // Logout function from Header component
  const handleLogout = () => {
    console.log("Logging out...");
    // Clear both tokens on logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEventData({ ...eventData, [e.target.name]: value })
    if (submitStatus.message) {
      setSubmitStatus({ type: null, message: null })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEventData({ ...eventData, image: file })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.starting_point || !eventData.route || !eventData.description) {
      setError("Please fill in all fields.")
      return
    }

    if (!eventData.image) {
      setError("Please upload an event image.")
      return
    }

    setError("")
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: null })

    const formData = new FormData()
    formData.append("title", eventData.title)
    formData.append("date", eventData.date)
    formData.append("time", eventData.time)
    formData.append("starting_point", eventData.starting_point)
    formData.append("route", eventData.route)
    formData.append("description", eventData.description)
    formData.append("image", eventData.image)
    formData.append("notifications_sent", eventData.send_notifications)
    
  // In handleSubmit function, modify the event creation section:

try {
  // First, create the event
  const eventResponse = await fetch("http://localhost:8000/events/", {
    method: "POST",
    body: formData,
  })

  if (eventResponse.ok) {
    const data = await eventResponse.json()
    console.log("Event created successfully:", data)
    const eventId = data.id // Make sure we're getting the correct event ID

    // After event is created, call the notification endpoint if notifications are enabled
    // In handleSubmit function, modify the notification sending section:

// After event is created, call the notification endpoint if notifications are enabled

// In your AdminDashboard.jsx, modify the notification sending part:

if (eventData.send_notifications) {
  try {
    console.log("Sending notification to all users for event:", eventId);
    
    const notificationResponse = await fetch("http://localhost:8000/events/send-email/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: eventId,
        action: "add",
        sendToAllUsers: true,
        // Add any required fields for your custom user model
        email: "all" // or other identifier your backend expects
      }),
    });

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.json();
      console.error("Notification error:", errorData);
      // Optionally show a warning instead of failing the whole operation
      setSubmitStatus({
        type: 'warning',
        message: 'Event created but notifications failed: ' + (errorData.error || "Unknown error"),
      });
    }
  } catch (notificationError) {
    console.error("Notification failed:", notificationError);
    // Continue with success message but note notification failure
    setSubmitStatus({
      type: 'warning',
      message: 'Event created but notifications failed to send',
    });
  }
}
    
    // Rest of your success handling...

        setSubmitStatus({
          type: 'success',
          message: 'Event created successfully!' + (eventData.send_notifications ? ' Notifications sent to all users.' : ''),
        })

        // Clear form
        setEventData({
          title: "",
          date: "",
          time: "",
          starting_point: "",
          route: "",
          description: "",
          image: null,
          send_notifications: true,
        })

        setEventImageUrl(eventData.image_url)
      } else {
        const errorData = await eventResponse.json()
        setError(errorData.error_message || "Error creating event. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearForm = () => {
    setEventData({
      title: "",
      date: "",
      time: "",
      starting_point: "",
      route: "",
      description: "",
      image: null,
      send_notifications: true,
    })
    setSubmitStatus({ type: null, message: null })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header with user info and logout button */}
      <div className="max-w-2xl mx-auto mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          {userName && <span className="text-sm font-medium">{userName}</span>}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-1 rounded-md bg-red-50 hover:bg-red-100 px-3 py-2 text-sm font-medium text-red-600"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 bg-slate-50 border-b">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a new event for your participants</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Status Message */}
          {submitStatus.message && (
            <div className={`p-3 mb-6 rounded-md ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {submitStatus.message}
            </div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm"
            >
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Event Details */}
            <div>
              <label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Info className="h-4 w-4" />
                Event Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter event title"
                value={eventData.title}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <CalendarIcon className="h-4 w-4" />
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4" />
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Starting Point */}
            <div>
              <label htmlFor="starting_point" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4" />
                Starting Point
              </label>
              <input
                id="starting_point"
                name="starting_point"
                type="text"
                placeholder="Enter the starting location"
                value={eventData.starting_point}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Route */}
            <div>
              <label htmlFor="route" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4" />
                Routes
              </label>
              <textarea
                id="route"
                name="route"
                placeholder="Describe the routes or checkpoints"
                value={eventData.route}
                onChange={handleChange}
                className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <Info className="h-4 w-4" />
                Event Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the event"
                value={eventData.description}
                onChange={handleChange}
                className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <img src="/path/to/icon.png" className="h-4 w-4" alt="Image Icon" />
                Event Image
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notification Toggle */}
            <div className="flex items-center">
              <input
                id="send_notifications"
                name="send_notifications"
                type="checkbox"
                checked={eventData.send_notifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="send_notifications" className="ml-2 text-sm font-medium text-gray-700 flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                Send notification emails to all users
              </label>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Create Event"}
              </button>
            </div>
          </div>
        </form>

        {/* Display the event image */}
        {eventImageUrl && (
          <div className="mt-4 p-6">
            <h3 className="font-medium text-gray-700">Event Image</h3>
            <img src={eventImageUrl} alt="Event" className="w-full mt-2 rounded-md" />
          </div>
        )}
      </motion.div>
    </div>
  )
}