"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CalendarIcon, Clock, MapPin, FileText, Info } from "lucide-react"

export default function AdminDashboard() {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    starting_point: "",
    route: "",
    description: "",
    image: null,  // Added image field here
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: null })
  const [error, setError] = useState("")
  const [eventImageUrl, setEventImageUrl] = useState("")  // State to store image URL
  const navigate = useNavigate()

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value })
    if (submitStatus.message) {
      setSubmitStatus({ type: null, message: null })
    }
  }

  // Handle image change
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
    formData.append("image", eventData.image)  // Append image

    try {
      const response = await fetch("http://localhost:8000/events/", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Event created successfully:", data)

        // Assuming your backend returns the image URL in the 'image_url' field
        const imageUrl = data.image_url  // This is an example, adjust as per your backend response

        setSubmitStatus({
          type: 'success',
          message: 'Event created successfully!',
        })

        // Clear form
        setEventData({
          title: "",
          date: "",
          time: "",
          starting_point: "",
          route: "",
          description: "",
          image: null,  // Reset image
        })

        // Optionally, store the image URL to display it on the page
        setEventImageUrl(imageUrl)  // Save the image URL in the state
      } else {
        const errorData = await response.json()
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
      image: null,  // Reset image
    })
    setSubmitStatus({ type: null, message: null })
  }

  return (
    <div className="container mx-auto py-8 px-4">
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
              <label htmlFor="title" className=" text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
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
                <label htmlFor="time" className=" text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
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
              <label htmlFor="starting_point" className=" text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
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
              <label htmlFor="route" className=" text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
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
              <label htmlFor="description" className=" text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
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
                onChange={handleImageChange}  // Handle image upload
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
          <div className="mt-4">
            <h3 className="font-medium text-gray-700">Event Image</h3>
            <img src={eventImageUrl} alt="Event" className="w-full mt-2 rounded-md" />
          </div>
        )}
      </motion.div>
    </div>
  )
}
