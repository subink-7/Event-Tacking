import { useState, useEffect } from "react";
import { Header } from "../../utils/components/Header";
import { Footer } from "../../utils/components/Footer";
import Eventcard from "../../Homepage/components/Eventcard";

function AllEventsPage() {
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
        // Sort events by nearest date (earliest first)
        const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#fcf9f5] font-sans flex flex-col">
      {/* Header */}
      <div className="relative z-10 w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Eventcard key={event.id} {...event} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default AllEventsPage;
