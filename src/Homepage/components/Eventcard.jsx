import React, { useState } from "react";
import { Calendar, MapPin, Clock, ChevronDown, ChevronUp } from "lucide-react";

const BASE_URL = "http://127.0.0.1:8000/"; // Change this to your backend URL

function Eventcard({ id, title, date, time, starting_point, route, description, image }) {
  const [expanded, setExpanded] = useState(false);
  
  // Correct the image URL construction
  const imageUrl = image && !image.startsWith("http") ? `${BASE_URL}${image}` : image || "/placeholder.svg"; // Check if it's already a full URL
  
  // Format route array to display properly if it's an array
  const displayRoute = Array.isArray(route) ? route.join(" → ") : route;
  
  // Parse route string into an array if it's a string
  const routeArray = Array.isArray(route) ? route : route?.split(',').map(item => item.trim());

  return (
    <div className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${expanded ? 'h-auto' : 'h-[400px]'}`}>
      {/* Card background image */}
      <div className={`${expanded ? 'h-[400px]' : 'absolute inset-0'}`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "/placeholder.svg"; }} // Fallback in case of an error
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Card content */}
      <div className={`${expanded ? 'relative bg-black/80 text-white' : 'absolute inset-0'} flex flex-col justify-end p-6 text-white`}>
        <div className="flex items-center mb-2 opacity-90">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{date} at {time}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-red-300 transition-colors">{title}</h3>
        <p className="text-white/80 text-sm mb-2">Starting Point: {starting_point}</p>
        
        {!expanded && (
          <>
            <p className="text-white/80 text-sm mb-2">Route: {displayRoute}</p>
            <p className="text-white/80 text-sm line-clamp-2">{description}</p>
          </>
        )}
        
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="w-full py-2 mt-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium flex items-center justify-center"
        >
          {expanded ? (
            <>Hide Details <ChevronUp className="h-4 w-4 ml-1" /></>
          ) : (
            <>View Details <ChevronDown className="h-4 w-4 ml-1" /></>
          )}
        </button>
        
        {/* Expanded content */}
        {expanded && (
          <div className="mt-6 animate-[fadeIn_0.3s_ease-in-out]">
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Description:</h4>
              <p className="text-white/80">{description}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Route Details:</h4>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                {routeArray?.map((stop, index) => (
                  <li key={index}>{stop}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg mt-4">
              <h4 className="text-lg font-semibold mb-2">Event Information</h4>
              <div className="space-y-2">
                <p className="flex items-center text-white/90">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-medium">Date:</span> 
                  <span className="ml-2">{date}</span>
                </p>
                <p className="flex items-center text-white/90">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">Time:</span> 
                  <span className="ml-2">{time}</span>
                </p>
                <p className="flex items-center text-white/90">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="font-medium">Location:</span> 
                  <span className="ml-2">{starting_point}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Eventcard;