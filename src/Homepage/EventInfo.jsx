"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../utils/components/Header"
import { useParams, useLocation, Link } from "react-router-dom"
import { Calendar, MapPin, Clock, ArrowLeft, Users, Heart, Share2 } from "lucide-react"
import { Footer } from "../utils/components/Footer"
import { MapComponent } from "./components/MapComponent"


export default function EventInfo() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const location = useLocation()
  const eventData = location.state?.eventData
  const navigate = useNavigate()

  // State for map markers
  const [mapMarkers, setMapMarkers] = useState([])
  const [mapCenter, setMapCenter] = useState([27.7172, 85.3240]) // Default to Kathmandu

  const goto = () => navigate("/calendar")

  useEffect(() => {
    // If eventData was passed via location state, use it directly
    if (eventData) {
      setEvent(eventData)
      processEventData(eventData)
      setLoading(false)
      return
    }

    // Otherwise fetch from API
    if (id) {
      fetch(`http://localhost:8000/events/${id}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch event details")
          }
          return response.json()
        })
        .then((data) => {
          setEvent(data)
          processEventData(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching event:", error)
          setLoading(false)
        })
    }
  }, [id, eventData])

  // Process event data for map markers
// Process event data for map markers
const processEventData = (eventData) => {
  if (eventData) {
    console.log("Processing event data:", eventData);
    
    // Set the map center
    if (eventData.latitude && eventData.longitude) {
      setMapCenter([parseFloat(eventData.latitude), parseFloat(eventData.longitude)]);
      
      // Process route data
      if (eventData.route) {
        try {
          // First, remove the outer quotes if they exist
          let routeString = eventData.route;
          if (routeString.startsWith('"') && routeString.endsWith('"')) {
            routeString = routeString.slice(1, -1);
          }
          
          // Then unescape the inner quotes
          routeString = routeString.replace(/\\"/g, '"');
          
          console.log("Cleaned route string:", routeString);
          const routeData = JSON.parse(routeString);
          console.log("Parsed route data:", routeData);
          
          if (Array.isArray(routeData)) {
            const markers = routeData.map((point, index) => {
              return {
                position: [parseFloat(point.lat), parseFloat(point.lng)],
                title: point.name,
                description: index === 0 ? "Starting Point" : 
                          index === routeData.length - 1 ? "Final Destination" : 
                          "Checkpoint",
                index: index + 1
              };
            });
            
            console.log("Created markers:", markers);
            setMapMarkers(markers);
          }
        } catch (error) {
          console.error("Error parsing route data:", error);
          
          // Fallback to regex approach if JSON parsing fails
          try {
            const routeStr = eventData.route;
            const regex = /"name":"([^"]+)"[^"]*"lat":([^,]+)[^"]*"lng":([^}]+)/g;
            const markers = [];
            let match;
            let index = 1;
            
            while ((match = regex.exec(routeStr)) !== null) {
              const [_, name, lat, lng] = match;
              markers.push({
                position: [parseFloat(lat), parseFloat(lng)],
                title: name,
                description: index === 1 ? "Starting Point" : "Checkpoint",
                index: index
              });
              index++;
            }
            
            // Update the last point's description if we have multiple points
            if (markers.length > 1) {
              markers[markers.length - 1].description = "Final Destination";
            }
            
            console.log("Created markers with regex fallback:", markers);
            setMapMarkers(markers);
          } catch (regexError) {
            console.error("Regex fallback also failed:", regexError);
          }
        }
      }
    }
  }
};
  // Parse route string into an array if it's a string
// Parse route data
const getRouteArray = () => {
  if (!event?.route) return [];
  
  try {
    // First clean the route string
    let routeString = event.route;
    if (typeof routeString === 'string') {
      if (routeString.startsWith('"') && routeString.endsWith('"')) {
        routeString = routeString.slice(1, -1);
      }
      routeString = routeString.replace(/\\"/g, '"');
      
      const routeData = JSON.parse(routeString);
      return Array.isArray(routeData) ? routeData.map(point => point.name) : [];
    }
    return [];
  } catch (error) {
    console.error("Error parsing route names:", error);
    
    // Regex fallback for route names
    try {
      const routeStr = event.route;
      const regex = /"name":"([^"]+)"/g;
      const names = [];
      let match;
      
      while ((match = regex.exec(routeStr)) !== null) {
        names.push(match[1]);
      }
      
      return names;
    } catch (regexError) {
      console.error("Regex fallback for names failed:", regexError);
      return [];
    }
  }
};

const routeArray = getRouteArray()

  // Format image URL

  

  // Create polyline points for the route
  const polylinePoints = mapMarkers.map(marker => marker.position)
  console.log (polylinePoints)
  console.log (routeArray)

  const imageUrl =
    event?.image && !event.image.startsWith("http")
      ? `http://127.0.0.1:8000/${event.image}`
      : event?.image || "/placeholder.svg"

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading amazing event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white font-sans">
        <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm shadow-sm">
          <Header />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-10 w-10 text-rose-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-8">
              The event you're looking for could not be found or may have been removed.
            </p>
            <Link
              to="/alleventpage"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm shadow-sm">
        <Header />
      </div>

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/alleventpage"
          className="inline-flex items-center text-gray-700 hover:text-rose-500 transition-colors font-medium"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Events
        </Link>
      </div>

      {/* Event Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Event Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] group">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "/placeholder.svg"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="inline-block px-4 py-1 bg-rose-500 rounded-full text-sm font-semibold mb-3">
                Featured Event
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-6">
              <div className="flex items-center mb-3 text-rose-500">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {event.date} at {event.time}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-gray-800 leading-tight">{event.title}</h1>
              <p className="flex items-center text-gray-700 mb-4">
                <MapPin className="h-5 w-5 mr-2 text-rose-500 flex-shrink-0" />
                <span className="text-lg">{event.starting_point}</span>
              </p>
            </div>

            <div className="p-5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl mb-6 border border-rose-100">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">Event Information</h3>
              <div className="space-y-3">
                <p className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-rose-500" />
                  <span className="font-medium text-gray-700 w-28">Date:</span>
                  <span className="text-gray-600">{event.date}</span>
                </p>
                <p className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-rose-500" />
                  <span className="font-medium text-gray-700 w-28">Time:</span>
                  <span className="text-gray-600">{event.time}</span>
                </p>
                <p className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-rose-500" />
                  <span className="font-medium text-gray-700 w-28">Starting Point:</span>
                  <span className="text-gray-600">{event.starting_point}</span>
                </p>
                <p className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-rose-500" />
                  <span className="font-medium text-gray-700 w-28">Participants:</span>
                  <span className="text-gray-600">Open to all</span>
                </p>
              </div>
            </div>

            <a
              href="#route-details"
              className="inline-block px-6 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full text-center transform hover:-translate-y-1"
            >
              View Route Details
            </a>
          </div>
        </div>
      </div>

      {/* Event Description */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 inline-block pb-2 border-b-2 border-rose-300">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 inline-block pb-2 border-b-2 border-rose-300">
            Event Map
          </h2>
          
          {/* Map Component */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <MapComponent
              center={mapCenter}
              markers={mapMarkers}
              polylinePoints={polylinePoints}
              height="384px"
            />
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <p>The map shows the event route from {routeArray[0]} to {routeArray[routeArray.length - 1]}. Click on markers to see details.</p>
          </div>
        </div>
      </div>

      {/* Route Details */}
      <div id="route-details" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 inline-block pb-2 border-b-2 border-rose-300">
            Route Details
          </h2>

          <div className="relative">
            {/* Route path visualization */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 to-amber-500 rounded-full"></div>

            <ul className="space-y-8 pl-12 relative">
              {routeArray.map((stop, index) => (
                <li key={index} className="relative">
                  {/* Circle marker */}
                  <div className="absolute left-[-32px] w-8 h-8 bg-white rounded-full border-2 border-rose-500 flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-rose-500">{index + 1}</span>
                  </div>

                  <div
                    className={`bg-gradient-to-r ${index === 0 ? "from-rose-50 to-rose-100" : index === routeArray.length - 1 ? "from-amber-50 to-amber-100" : "from-gray-50 to-gray-100"} rounded-xl p-5 shadow-md border ${index === 0 ? "border-rose-200" : index === routeArray.length - 1 ? "border-amber-200" : "border-gray-200"}`}
                  >
                    <h3 className="font-medium text-gray-800 text-lg">{stop}</h3>
                    {index === 0 && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-rose-500" />
                        Starting Point
                      </p>
                    )}
                    {index === routeArray.length - 1 && index !== 0 && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                        Final Destination
                      </p>
                    )}
                    {index !== 0 && index !== routeArray.length - 1 && (
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        Checkpoint
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Join Event CTA */}
          <div className="mt-12 bg-gradient-to-r from-rose-100 to-amber-100 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Secure your spot now and be part of this amazing experience by tracking your Event!</h3>
            <button onClick={goto} className="px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Track your Event 
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto">
        <Footer/>
      </div>
    </div>
  )
}