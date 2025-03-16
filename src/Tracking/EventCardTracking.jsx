import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";


const BASE_URL = "http://127.0.0.1:8000/"; // Change this to your backend URL



function EventcardTracking({ id, title, date, time, starting_point, route, description, image }) {
  // Correct the image URL construction
  const imageUrl = image && !image.startsWith("http") ? `${BASE_URL}${image}` : image || "/placeholder.svg"; // Check if it's already a full URL
  const navigate = useNavigate();
  const goToEventTracking = () => navigate("/calendar");

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[400px]">
      {/* Card background image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "/placeholder.svg"; }} // Fallback in case of an error
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Card content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div className="flex items-center mb-2 opacity-90">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{date} at {time}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-red-300 transition-colors">{title}</h3>
        <p className="text-white/80 text-sm mb-2">Starting Point: {starting_point}</p>
        <p className="text-white/80 text-sm mb-2">Route: {route}</p>
        <p className="text-white/80 text-sm line-clamp-2">{description}</p>
        <button onClick={goToEventTracking} className="w-full py-2 mt-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
       Track your event
        </button>
      </div>
    </div>
  );
}

export default EventcardTracking;
