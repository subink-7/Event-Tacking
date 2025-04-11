"use client"

import { useState, useEffect } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfWeek,
  addDays,
  getDay
} from "date-fns"
import { useSelector, useDispatch } from "react-redux"
import { addNotification, removeNotification, selectNotifications } from "../services/notificationSlice"
import { Header } from "../utils/components/Header"
import { ToastContainer, toast } from "react-toastify"
import { FaChevronLeft, FaChevronRight, FaArrowLeft, FaBell, FaCalendarAlt, FaRegBell } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import CalendarCard from "./CalendarCard"
import "react-toastify/dist/ReactToastify.css"

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notifications = useSelector(selectNotifications)

  useEffect(() => {
    fetch("http://localhost:8000/events/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        return response.json()
      })
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
        setEvents([
          // Mock data if fetch fails
          {
            id: 1,
            title: "Yomari Punhi",
            date: "2024-12-28",
            type: "cultural",
            image: "/photos/yomaripunhi.jpg",
            description: "Traditional Newari festival celebrating the harvest.",
            location: "Kathmandu Valley",
          },
          {
            id: 2,
            title: "Lhosar Parva",
            date: "2025-01-29",
            type: "cultural",
            image: "/photos/lhosar.jpg",
            description: "New Year celebration of the Tibetan community.",
            location: "Bouddhanath, Kathmandu",
          },
          {
            id: 3,
            title: "Matina Paru",
            date: "2025-02-05",
            type: "festival",
            image: "/photos/matina.jpg",
            description: "Traditional Newari festival celebrating lights.",
            location: "Patan, Lalitpur",
          },
          {
            id: 4,
            title: "Buddha Jayanti",
            date: "2025-05-15",
            type: "religious",
            image: "/photos/buddha.jpg",
            description: "Celebration of Buddha's birth, enlightenment and death.",
            location: "Lumbini",
          },
          {
            id: 5,
            title: "Dashain Festival",
            date: "2025-10-03",
            type: "major-festival",
            image: "/photos/dashain.jpg",
            description: "The biggest Hindu festival in Nepal celebrating the victory of good over evil.",
            location: "Nationwide",
          },
        ])
      })
  }, [])

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const handleBackToTracking = () => navigate("/tracking")

  // Get the first day of the month
  const monthStart = startOfMonth(currentDate)
  // Get the last day of the month
  const monthEnd = endOfMonth(currentDate)
  // Get the first day of the first week of the month
  const startDate = startOfWeek(monthStart)
  // Generate calendar days including days from previous and next months to fill weeks
  const dateRange = eachDayOfInterval({ 
    start: startDate, 
    end: addDays(endOfMonth(currentDate), 6 - getDay(monthEnd)) 
  })

  const normalizeEvents = () =>
    events.map((event) => ({
      ...event,
      date: new Date(event.date),
    }))

  const eventsThisMonth = normalizeEvents().filter((event) => isSameMonth(event.date, currentDate))

  // Get user email from localStorage - using the correct key "email"
  const getUserEmail = () => {
    const storedEmail = localStorage.getItem("email")

    if (!storedEmail) {
      toast.error("You must be logged in to set reminders.", {
        toastId: `error-${Date.now()}`,
        position: "bottom-right",
      })
      return null
    }

    return storedEmail
  }

  const sendNotificationToBackend = (event, isAdding) => {
    const action = isAdding ? "add" : "remove"

    // Get user email from localStorage
    const recipientEmail = getUserEmail()

    if (!recipientEmail) {
      return // Toast already shown in getUserEmail
    }

    fetch("http://localhost:8000/events/send_notifications/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: event.id,
        action: action,
        title: event.title,
        date: event.date.toISOString(),
        email: recipientEmail,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || "Failed to send notification to server")
          })
        }
        return response.json()
      })
      .then((data) => {
        console.log("Notification API response:", data)
        toast.success(`${data.message || "Operation successful"}`, {
          toastId: `success-${Date.now()}`,
          position: "bottom-right",
        })
      })
      .catch((error) => {
        console.error("Error sending notification:", error)
        toast.error(`${error.message || "Unknown error occurred"}`, {
          toastId: `error-${Date.now()}`,
          position: "bottom-right",
        })
      })
  }

  const toggleNotification = (event) => {
    const isAdding = !notifications.some((n) => n.id === event.id)

    // Check if we have an email before proceeding
    const email = getUserEmail()
    if (!email) return

    const serializedEvent = {
      ...event,
      date: event.date.toISOString(),
    }

    // First update the Redux store
    if (isAdding) {
      dispatch(addNotification(serializedEvent))
      toast.success(`Reminder set for ${event.title}`, {
        toastId: `add-${event.id}-${Date.now()}`,
      })
    } else {
      dispatch(removeNotification(event.id))
      toast.error(`Reminder removed for ${event.title}`, {
        toastId: `remove-${event.id}-${Date.now()}`,
      })
    }

    // Then communicate with the backend
    sendNotificationToBackend(event, isAdding)
  }

  const getEventsForDay = (day) => normalizeEvents().filter((event) => isSameDay(event.date, day))

  // Function to determine event dot color based on event type
  const getEventTypeColor = (type) => {
    switch (type) {
      case "cultural":
        return "bg-orange-500"
      case "religious":
        return "bg-purple-500"
      case "festival":
        return "bg-green-500"
      case "major-festival":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  // Handle event click to show the calendar card
  const handleEventClick = (event) => {
    // Format the date to display in calendar card
    const formattedEvent = {
      ...event,
      date: format(new Date(event.date), "MMMM d, yyyy"),
    }
    setSelectedEvent(formattedEvent)
  }

  // Close the selected event view
  const closeEventView = () => {
    setSelectedEvent(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 font-sans pb-12 relative">
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Back button and page title */}
        <div className="py-6 flex items-center justify-between">
          <button
            onClick={handleBackToTracking}
            className="flex items-center px-4 py-2 text-indigo-600 bg-white/80 rounded-lg shadow-sm hover:bg-white hover:text-indigo-700 transition duration-150"
          >
            <FaArrowLeft className="mr-2" /> 
          </button>
         
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 flex-grow">
            {/* Calendar header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-full hover:bg-white/20 transition duration-200 flex items-center justify-center"
                  aria-label="Previous month"
                >
                  <FaChevronLeft />
                </button>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-indigo-200" />
                  <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-full hover:bg-white/20 transition duration-200 flex items-center justify-center"
                  aria-label="Next month"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Calendar body */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600">Loading calendar events...</p>
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                    <p className="font-medium">Error loading events</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Event types legend */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                      <span className="text-gray-700">Cultural</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                      <span className="text-gray-700">Religious</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-gray-700">Festival</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                      <span className="text-gray-700">Major Festival</span>
                    </div>
                  </div>

                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center font-medium text-gray-500 pb-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {dateRange.map((day, i) => {
                      const dayEvents = getEventsForDay(day)
                      const isCurrentMonth = isSameMonth(day, currentDate)
                      const hasEvents = dayEvents.length > 0

                      return (
                        <div
                          key={i}
                          className={`border rounded-lg p-2 ${
                            isToday(day)
                              ? "border-2 border-indigo-500 bg-indigo-50"
                              : isCurrentMonth
                                ? hasEvents
                                  ? "border-gray-200 bg-white hover:bg-indigo-50 hover:border-indigo-200"
                                  : "border-gray-200 bg-white hover:bg-gray-50"
                                : "border-gray-100 bg-gray-50/50 text-gray-400"
                          } transition duration-150 min-h-[5.5rem] ${hasEvents ? "cursor-pointer" : ""}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span
                              className={`text-sm font-medium ${
                                isToday(day)
                                  ? "bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                                  : ""
                              }`}
                            >
                              {format(day, "d")}
                            </span>
                            {hasEvents && (
                              <span className="text-xs text-gray-500">
                                {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>

                          <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className="flex items-center gap-1 py-1 px-1 rounded hover:bg-indigo-100 transition-colors"
                                onClick={() => handleEventClick(event)}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${getEventTypeColor(event.type)}`}
                                />
                                <span className="text-xs truncate hover:font-medium flex-grow">{event.title}</span>
                                <button
                                  className={`ml-auto flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                    notifications.some((n) => n.id === event.id)
                                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleNotification(event)
                                  }}
                                  aria-label={
                                    notifications.some((n) => n.id === event.id) ? "Remove reminder" : "Set reminder"
                                  }
                                >
                                  {notifications.some((n) => n.id === event.id) ? (
                                    <FaBell className="text-xs" />
                                  ) : (
                                    <FaRegBell className="text-xs" />
                                  )}
                                </button>
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer text-center mt-1"
                                onClick={() => handleEventClick(dayEvents[0])}
                              >
                                +{dayEvents.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Calendar Card Section */}
          {selectedEvent ? (
            <div className="lg:w-80 xl:w-96">
              <div className="sticky top-6">
                <button
                  onClick={closeEventView}
                  className="mb-2 flex items-center gap-1 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white hover:text-gray-900 transition duration-150 shadow-sm"
                >
                  <FaArrowLeft size={12} /> Close event details
                </button>
                <CalendarCard event={selectedEvent} />
              </div>
            </div>
          ) : (
            <div className="hidden lg:block lg:w-80 xl:w-96">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-6 border border-indigo-100">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCalendarAlt className="text-indigo-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Event Details</h3>
                  <p className="text-gray-600 mb-6">Select an event from the calendar to view its details</p>

                  <div className="bg-indigo-50 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-indigo-800 mb-2 flex items-center">
                      <FaBell className="mr-2 text-indigo-500" size={14} />
                      Reminder Tips
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Click on any event to view details
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Use the bell icon to set or remove reminders
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        Navigate between months using the arrows
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarPage