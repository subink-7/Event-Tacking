import { useState, useEffect } from "react";
import { Header } from "../../utils/components/Header";
import { Footer } from "../../utils/components/Footer";
import Eventcard from "./Eventcard";
import { Link } from "react-router-dom";

function EventsPage({ isHomepage = true }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/events/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        
        const now = new Date();
        const upcomingEvents = data.filter(event => new Date(event.date) >= now);
        
  
        const sortedEvents = upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);


  const displayedEvents = isHomepage ? events.slice(0, 3) : events;

  return (
    <div className="min-h-screen bg-[#fcf9f5] font-sans">
      {/* Header */}
      <div className="relative z-10 w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <Header />
      </div>

     
      {isHomepage && (
        <div className="relative w-full h-[60vh] max-h-[600px] overflow-hidden rounded-full mt-5">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/606897a42dd2949a562d0fc9bec01211ef20ece62d7178d2c8954ba50e7872a4"
            alt="Cultural event banner"
            className="object-cover w-full h-full scale-105 animate-[slowZoom_5s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
            <div className="text-center px-6 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl text-white mb-4 tracking-tight font-thin">
                <span className="block">Celebrating Nepal's</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-red-300">
                  Cultural Heritage
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Discover the rich tapestry of traditions, festivals, and celebrations that make Nepal unique.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative mb-16 text-center">
          <h2 className="inline-block text-4xl font-bold relative z-10">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600">
              {isHomepage ? "Upcoming Events" : "All Events"}
            </span>
            <div className="absolute -bottom-4 left-0 right-0 mx-auto w-40 h-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full"></div>
          </h2>
          <div className="mt-6 max-w-2xl mx-auto">
            <p className="text-gray-600">
              Join us in celebrating Nepal's rich cultural heritage through these special events.
            </p>
          </div>
        </div>

        {/* Event List */}
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : displayedEvents.length === 0 ? (
          <p className="text-center text-gray-600">No upcoming events scheduled at this time.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayedEvents.map((event) => (
                <Eventcard key={event.id} {...event} />
              ))}
            </div>
            
            {/* View All Events button - Only show on homepage */}
            {isHomepage && events.length > 3 && (
              <div className="mt-12 text-center">
                <Link 
                  to="/alleventpage" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  View All Events
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto">
        <Footer />
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

export default EventsPage;