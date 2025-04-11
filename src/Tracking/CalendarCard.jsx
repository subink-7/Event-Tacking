import React from "react";
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CalendarCard = ({ event }) => {
  const navigate = useNavigate();
  
  // Format image URL properly
  const imageUrl = event?.image && !event.image.startsWith("http")
    ? `http://127.0.0.1:8000/${event.image}`
    : event?.image || "/placeholder.svg";
  
  // Parse route if it exists
  const displayRoute = event?.route 
    ? Array.isArray(event.route) 
      ? event.route.join(" → ") 
      : event.route
    : null;

  // Handle navigation to event details page
  const handleViewDetails = () => {
    navigate(`/event/${event.id}`, {
      state: { eventData: event }
    });
  };

  return (
    <div className="group overflow-hidden rounded-xl shadow-lg bg-white border border-indigo-100">
      {/* Card image */}
      <div className="h-48 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "/placeholder.svg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold">{event.title}</h3>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-5">
        <div className="flex items-center text-gray-700 mb-3">
          <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
          <span className="text-sm font-medium">{event.date}</span>
        </div>
        
        {event.time && (
          <div className="flex items-center text-gray-700 mb-3">
            <Clock className="h-4 w-4 mr-2 text-indigo-600" />
            <span className="text-sm">{event.time}</span>
          </div>
        )}
        
        {event.location && (
          <div className="flex items-start text-gray-700 mb-3">
            <MapPin className="h-4 w-4 mr-2 text-indigo-600 mt-1 flex-shrink-0" />
            <span className="text-sm">{event.location}</span>
          </div>
        )}
        
        {displayRoute && (
          <div className="mb-3">
            <p className="text-sm text-gray-500 font-medium mb-1">Route:</p>
            <p className="text-sm text-gray-700">{displayRoute}</p>
          </div>
        )}
        
        {event.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 font-medium mb-1">Description:</p>
            <p className="text-sm text-gray-700 line-clamp-3">{event.description}</p>
          </div>
        )}
        
        <div className="mt-4">
          <button
            onClick={handleViewDetails}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            Learn More <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;