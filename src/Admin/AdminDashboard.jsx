              
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CalendarIcon, Clock, MapPin, FileText, Info, LogOut, Bell, MapPinOff, Globe } from "lucide-react"
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Header } from "../utils/components/Header"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AdminDashboard() {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    starting_point: "",
    route: "",
    description: "",
    image: null,
    send_notifications: true,
    latitude: null,
    longitude: null,
    locationVerified: false,
  })
  
  // Add state for route points
  const [routePoints, setRoutePoints] = useState([
    { name: "", lat: null, lng: null }
  ])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [eventImageUrl, setEventImageUrl] = useState("")
  const [userName, setUserName] = useState("")
  const [showMap, setShowMap] = useState(false)
  const [mapCenter, setMapCenter] = useState([27.7172, 85.3240]) // Default Kathmandu
  const [isGeocodingStarting, setIsGeocodingStarting] = useState(false)
  const [geocodingError, setGeocodingError] = useState("")
  const [activePointIndex, setActivePointIndex] = useState(null)
  
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

  // Set the first route point to match the starting point
  useEffect(() => {
    if (eventData.starting_point && routePoints.length > 0) {
      const updatedPoints = [...routePoints];
      updatedPoints[0].name = eventData.starting_point;
      
      // If starting point has coordinates, add them to the first route point
      if (eventData.latitude !== null && eventData.longitude !== null) {
        updatedPoints[0].lat = eventData.latitude;
        updatedPoints[0].lng = eventData.longitude;
      }
      
      setRoutePoints(updatedPoints);
    }
  }, [eventData.starting_point, eventData.latitude, eventData.longitude]);

  // Geocode function to convert address to coordinates using OpenStreetMap's Nominatim
  const geocodeLocation = async (locationName, pointIndex = null) => {
    setIsGeocodingStarting(true);
    setGeocodingError("");
    
    const toastId = toast.loading(`Verifying location: ${locationName}...`);
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);
        
        if (pointIndex !== null) {
          // Updating a route point
          const updatedPoints = [...routePoints];
          updatedPoints[pointIndex].lat = parsedLat;
          updatedPoints[pointIndex].lng = parsedLon;
          setRoutePoints(updatedPoints);
          
          // If it's the first point, also update the event starting point
          if (pointIndex === 0) {
            setEventData(prev => ({
              ...prev,
              latitude: parsedLat,
              longitude: parsedLon,
              locationVerified: true
            }));
          }
        } else {
          // Updating the starting point
          setEventData(prev => ({
            ...prev, 
            latitude: parsedLat, 
            longitude: parsedLon,
            locationVerified: true
          }));
          
          // Also update the first route point
          if (routePoints.length > 0) {
            const updatedPoints = [...routePoints];
            updatedPoints[0].lat = parsedLat;
            updatedPoints[0].lng = parsedLon;
            setRoutePoints(updatedPoints);
          }
        }
        
        setMapCenter([parsedLat, parsedLon]);
        setShowMap(true);
        toast.update(toastId, { 
          render: "Location verified successfully!", 
          type: "success", 
          isLoading: false, 
          autoClose: 3000 
        });
        return { lat: parsedLat, lon: parsedLon };
      } else {
        const errorMsg = "Location not found. Please enter a valid location or set coordinates manually.";
        setGeocodingError(errorMsg);
        toast.update(toastId, { 
          render: errorMsg, 
          type: "error", 
          isLoading: false, 
          autoClose: 4000 
        });
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      const errorMsg = "Error while geocoding. Please try again or set coordinates manually.";
      setGeocodingError(errorMsg);
      toast.update(toastId, { 
        render: errorMsg, 
        type: "error", 
        isLoading: false, 
        autoClose: 4000 
      });
      return null;
    } finally {
      setIsGeocodingStarting(false);
    }
  };

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
    
    // Reset location verification if starting point changes
    if (e.target.name === 'starting_point') {
      setEventData(prev => ({
        ...prev,
        [e.target.name]: value,
        locationVerified: false
      }));
    }
    
    // Clear any errors when user makes changes
    if (error) {
      setError("");
    }
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    
    if (!isNaN(parsedValue)) {
      setEventData(prev => ({
        ...prev,
        [name]: parsedValue
      }));
      
      // If updating starting point coordinates, also update the first route point
      if ((name === 'latitude' || name === 'longitude') && routePoints.length > 0) {
        const updatedPoints = [...routePoints];
        if (name === 'latitude') {
          updatedPoints[0].lat = parsedValue;
        } else if (name === 'longitude') {
          updatedPoints[0].lng = parsedValue;
        }
        setRoutePoints(updatedPoints);
      }
    }
  };

  // Handle route point name change
  const handleRoutePointNameChange = (index, value) => {
    const updatedPoints = [...routePoints];
    updatedPoints[index].name = value;
    setRoutePoints(updatedPoints);
  };

  // Handle route point coordinate change
  const handleRoutePointCoordinateChange = (index, field, value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      const updatedPoints = [...routePoints];
      updatedPoints[index][field] = parsedValue;
      setRoutePoints(updatedPoints);
      
      // If updating the first point coordinates, also update the event starting point
      if (index === 0) {
        if (field === 'lat') {
          setEventData(prev => ({ ...prev, latitude: parsedValue }));
        } else if (field === 'lng') {
          setEventData(prev => ({ ...prev, longitude: parsedValue }));
        }
      }
    }
  };

  // Add a new route point
  const addRoutePoint = () => {
    setRoutePoints([...routePoints, { name: "", lat: null, lng: null }]);
    toast.info("New route point added", { icon: "🚩" });
  };

  // Remove a route point
  const removeRoutePoint = (index) => {
    if (routePoints.length > 1) {
      const updatedPoints = [...routePoints];
      updatedPoints.splice(index, 1);
      setRoutePoints(updatedPoints);
      toast.info("Route point removed", { icon: "🗑️" });
    }
  };

  // Verify route point location
  const verifyRoutePointLocation = async (index) => {
    const pointName = routePoints[index].name;
    if (!pointName) {
      toast.error("Please enter a location name first");
      setGeocodingError("Please enter a location name first.");
      return;
    }
    
    setActivePointIndex(index);
    await geocodeLocation(pointName, index);
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    
    if (activePointIndex !== null) {
      // Update the active route point
      const updatedPoints = [...routePoints];
      updatedPoints[activePointIndex].lat = lat;
      updatedPoints[activePointIndex].lng = lng;
      setRoutePoints(updatedPoints);
      
      // If updating the first point, also update the event starting point
      if (activePointIndex === 0) {
        setEventData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          locationVerified: true
        }));
      }
      
      toast.info(`Updated coordinates for point #${activePointIndex + 1}`, {
        autoClose: 2000
      });
    } else {
      // Default - update the starting point
      setEventData(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        locationVerified: true
      }));
      
      // Also update the first route point
      if (routePoints.length > 0) {
        const updatedPoints = [...routePoints];
        updatedPoints[0].lat = lat;
        updatedPoints[0].lng = lng;
        setRoutePoints(updatedPoints);
      }
      
      toast.info("Updated starting point coordinates", {
        autoClose: 2000
      });
    }
  };

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick
    });
    return null;
  };

  const handleVerifyLocation = async () => {
    if (!eventData.starting_point) {
      toast.error("Please enter a starting point first");
      setGeocodingError("Please enter a starting point first.");
      return;
    }
    
    setActivePointIndex(null); // Set to null to indicate we're verifying the starting point
    await geocodeLocation(eventData.starting_point);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEventData({ ...eventData, image: file })
      toast.info(`Image selected: ${file.name}`, {
        icon: "🖼️",
        autoClose: 2000
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!eventData.title || !eventData.date || !eventData.time || !eventData.starting_point || !eventData.description) {
      toast.error("Please fill in all required fields");
      setError("Please fill in all required fields.")
      return
    }

    if (!eventData.image) {
      toast.error("Please upload an event image");
      setError("Please upload an event image.")
      return
    }
    
    // Validate coordinates
    if (!eventData.latitude || !eventData.longitude) {
      toast.error("Please verify location to set coordinates for mapping");
      setError("Please verify location to set coordinates for mapping.")
      return
    }
    
    // Validate route points
    if (routePoints.length < 2) {
      toast.error("Please add at least two route points (starting and ending points)");
      setError("Please add at least two route points (starting and ending points).")
      return
    }
    
    // Check if all route points have names
    if (routePoints.some(point => !point.name.trim())) {
      toast.error("All route points must have names");
      setError("All route points must have names.")
      return
    }

    setError("")
    setIsSubmitting(true)
    
    // Create a loading toast that will be updated
    const toastId = toast.loading("Creating event, please wait...");

    const formData = new FormData()
    formData.append("title", eventData.title)
    formData.append("date", eventData.date)
    formData.append("time", eventData.time)
    formData.append("starting_point", eventData.starting_point)
    formData.append("description", eventData.description)
    formData.append("image", eventData.image)
    formData.append("notifications_sent", eventData.send_notifications)
    formData.append("latitude", eventData.latitude)
    formData.append("longitude", eventData.longitude)
    
    // Add route points as JSON string
    formData.append("route", JSON.stringify(routePoints))
    
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

        // After event is created, update toast to show notification is being sent
        if (eventData.send_notifications) {
          toast.update(toastId, { 
            render: "Event created! Sending notifications to all users...", 
            isLoading: true 
          });
          
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
                email: "all"
              }),
            });

            if (!notificationResponse.ok) {
              const errorData = await notificationResponse.json();
              console.error("Notification error:", errorData);
              toast.update(toastId, { 
                render: "Event created but notifications failed to send", 
                type: "warning", 
                isLoading: false, 
                autoClose: 5000 
              });
            } else {
              toast.update(toastId, { 
                render: "Event created and notifications sent successfully!", 
                type: "success", 
                isLoading: false, 
                autoClose: 5000 
              });
            }
          } catch (notificationError) {
            console.error("Notification failed:", notificationError);
            toast.update(toastId, { 
              render: "Event created but notifications failed to send", 
              type: "warning", 
              isLoading: false, 
              autoClose: 5000 
            });
          }
        } else {
          toast.update(toastId, { 
            render: "Event created successfully!", 
            type: "success", 
            isLoading: false, 
            autoClose: 5000 
          });
        }

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
          latitude: null,
          longitude: null,
          locationVerified: false,
        })
        
        // Reset route points
        setRoutePoints([{ name: "", lat: null, lng: null }]);

        setEventImageUrl(data.image_url)
        setShowMap(false)
      } else {
        const errorData = await eventResponse.json()
        const errorMessage = errorData.error_message || "Error creating event. Please try again.";
        setError(errorMessage)
        toast.update(toastId, { 
          render: errorMessage, 
          type: "error", 
          isLoading: false, 
          autoClose: 5000 
        });
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
      toast.update(toastId, { 
        render: "Network error. Please try again later.", 
        type: "error", 
        isLoading: false, 
        autoClose: 5000 
      });
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
      latitude: null,
      longitude: null,
      locationVerified: false,
    })
    setRoutePoints([{ name: "", lat: null, lng: null }]);
    setError("")
    setShowMap(false)
    toast.info("Form cleared", { autoClose: 2000 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white font-sans">
      <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm shadow-sm">
        <Header/>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6 bg-slate-50 border-b">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a new event for your participants</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm mb-6"
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

            {/* Starting Point with Location Verification */}
            <div>
              <label htmlFor="starting_point" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4" />
                Starting Point
              </label>
              <div className="flex gap-2">
                <input
                  id="starting_point"
                  name="starting_point"
                  type="text"
                  placeholder="Enter the starting location"
                  value={eventData.starting_point}
                  onChange={handleChange}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyLocation}
                  disabled={isGeocodingStarting || !eventData.starting_point}
                  className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1"
                >
                  {isGeocodingStarting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4" />
                      <span>Verify Location</span>
                    </>
                  )}
                </button>
              </div>
              {geocodingError && (
                <p className="mt-1 text-sm text-red-500">{geocodingError}</p>
              )}
              {eventData.locationVerified && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location verified! Coordinates set for mapping.
                </p>
              )}
            </div>

            {/* Coordinates (optional manual input) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.0000001"
                  placeholder="e.g. 27.7172"
                  value={eventData.latitude || ''}
                  onChange={handleCoordinateChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.0000001"
                  placeholder="e.g. 85.3240"
                  value={eventData.longitude || ''}
                  onChange={handleCoordinateChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Map Preview */}
            {showMap && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4" />
                  Location Preview (Click to adjust pin location)
                </label>
                <div className="h-72 rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {routePoints.map((point, idx) => (
                      point.lat && point.lng && (
                        <Marker 
                          key={idx} 
                          position={[point.lat, point.lng]}
                        />
                      )
                    ))}
                    <MapClickHandler />
                  </MapContainer>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Click on the map to refine the active point location if needed.
                </p>
              </div>
            )}

            {/* Route Points */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                Route Points
              </label>
              <div className="space-y-3">
                {routePoints.map((point, index) => (
                  <div key={index} className="flex flex-col border p-3 rounded-md bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Point {index + 1} {index === 0 ? '(Starting Point)' : ''}</span>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeRoutePoint(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="mb-2">
                      <label className="text-xs text-gray-600 mb-1 block">Location Name</label>
                      <input
                        type="text"
                        value={point.name}
                        onChange={(e) => handleRoutePointNameChange(index, e.target.value)}
                        placeholder="Enter location name"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={index === 0} // Disable if it's the starting point
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Latitude</label>
                        <input
                          type="number"
                          step="0.0000001"
                          value={point.lat || ''}
                          onChange={(e) => handleRoutePointCoordinateChange(index, 'lat', e.target.value)}
                          placeholder="Latitude"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Longitude</label>
                        <input
                          type="number"
                          step="0.0000001"
                          value={point.lng || ''}
                          onChange={(e) => handleRoutePointCoordinateChange(index, 'lng', e.target.value)}
                          placeholder="Longitude"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => verifyRoutePointLocation(index)}
                        disabled={isGeocodingStarting || !point.name}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm self-start flex items-center gap-1"
                      >
                        {isGeocodingStarting && activePointIndex === index ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Globe className="h-3 w-3" />
                            <span>Verify Location</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addRoutePoint}
                  className="mt-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-sm flex items-center gap-1"
                >
                  <MapPin className="h-4 w-4" />
                  Add Route Point
                </button>
              </div>
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

            {/* Form Buttons */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={clearForm}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <span>Clear Form</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-4 rounded-md disabled:opacity-70 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Create Event</span>
                  </>
                )}
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
      
      {/* Toast container - positioned in the top right corner */}
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
    </div>
  )
}