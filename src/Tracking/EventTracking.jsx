import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../utils/components/Header";
import EventcardTracking from "./EventCardTracking";

const EventTracking = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState("January 2025");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = January
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/events/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Days of week for calendar
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get days in month and starting day of month
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonthIndex);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthIndex);
  
  // Get days from previous month to fill calendar
  const daysInPrevMonth = currentMonthIndex === 0 
    ? getDaysInMonth(currentYear - 1, 11) 
    : getDaysInMonth(currentYear, currentMonthIndex - 1);
  
 
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => 
    daysInPrevMonth - firstDayOfMonth + i + 1
  );
  
 
  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  
  
  const nextMonthDays = Array.from(
    { length: 42 - (prevMonthDays.length + currentMonthDays.length) }, 
    (_, i) => i + 1
  );

  // Navigate months
  const navigateMonth = (direction) => {
    const newMonthIndex = currentMonthIndex + direction;
    let newYear = currentYear;
    
    if (newMonthIndex < 0) {
      newYear = currentYear - 1;
      setCurrentMonthIndex(11);
      setCurrentYear(newYear);
    } else if (newMonthIndex > 11) {
      newYear = currentYear + 1;
      setCurrentMonthIndex(0);
      setCurrentYear(newYear);
    } else {
      setCurrentMonthIndex(newMonthIndex);
    }
    
    const newMonth = new Date(
      newMonthIndex < 0 ? newYear : newMonthIndex > 11 ? newYear : currentYear, 
      newMonthIndex < 0 ? 11 : newMonthIndex > 11 ? 0 : newMonthIndex
    ).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    setCurrentMonth(newMonth);
    setSelectedDay(null);
  };


  const getMonthEvents = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonthIndex && 
             eventDate.getFullYear() === currentYear &&
             (!selectedDay || eventDate.getDate() === selectedDay);
    });
  };


  const hasEvent = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return false;
    
    return events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentMonthIndex &&
             eventDate.getFullYear() === currentYear;
    });
  };

  
  const getEventsForDay = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === currentMonthIndex &&
             eventDate.getFullYear() === currentYear;
    });
  };

  // Handle day selection
  const handleDayClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) {
     
      if (day > 20) {
        navigateMonth(-1);
      } else {
        navigateMonth(1);
      }
      return;
    }
    
    if (selectedDay === day) {
      setSelectedDay(null); // Deselect if already selected
    } else {
      setSelectedDay(day);
    }
  };


  const getDayClass = (day, isCurrentMonth = true) => {
    let classes = "relative h-12 flex items-center justify-center border rounded-lg ";
    
    if (!isCurrentMonth) {
      classes += "text-gray-400 bg-gray-50 ";
    } else if (selectedDay === day) {
      classes += "bg-blue-600 text-white font-bold ring-2 ring-blue-300 ";
    } else if (hasEvent(day, isCurrentMonth)) {
      const events = getEventsForDay(day, isCurrentMonth);
      const hasFestival = events.some(event => 
        event?.title?.toLowerCase().includes("festival")
      );
      
      if (hasFestival) {
        classes += "bg-green-600 text-white font-bold ";
      } else {
        classes += "bg-red-500 text-white font-bold ";
      }
    } else {
      classes += "hover:bg-gray-100 ";
    }

    return classes + "transition-colors duration-200 cursor-pointer";
  };

 
  const getEventsSectionTitle = () => {
    if (selectedDay) {
      return `Events on ${new Date(currentYear, currentMonthIndex, selectedDay).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }
    return `Events in ${currentMonth}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 font-sans pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full bg-white/90 backdrop-blur-md shadow-md">
        <Header />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img
            src="/photos/frame.png"
            alt="Nepal temples and buildings skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Festivals and Events</h1>
          <p className="text-lg md:text-xl opacity-90">
            Discover Nepal's rich cultural heritage through its vibrant celebrations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Calendar Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Cultural Calendar</h2>
            <Link
              to="/calendar"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors duration-300 flex items-center font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Track you event
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 mr-2"
                  onClick={() => navigateMonth(-1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-xl font-bold text-gray-800">{currentMonth}</span>
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 ml-2"
                  onClick={() => navigateMonth(1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button className="px-3 py-1.5 rounded-md text-sm font-medium">Week</button>
                <button className="px-3 py-1.5 bg-white shadow rounded-md text-sm font-medium text-green-600">
                  Month
                </button>
                <button className="px-3 py-1.5 rounded-md text-sm font-medium">Day</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="text-center font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Previous month days */}
              {prevMonthDays.map((day) => (
                <div 
                  key={`prev-${day}`} 
                  className={getDayClass(day, false)}
                  onClick={() => handleDayClick(day, false)}
                >
                  {day}
                </div>
              ))}
              
              {/* Current month days */}
              {currentMonthDays.map((day) => (
                <div 
                  key={`day-${day}`} 
                  className={getDayClass(day, true)}
                  onClick={() => handleDayClick(day, true)}
                >
                  {day}
                  {hasEvent(day, true) && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                  )}
                </div>
              ))}
              
              {/* Next month days */}
              {nextMonthDays.map((day) => (
                <div 
                  key={`next-${day}`} 
                  className={getDayClass(day, false)}
                  onClick={() => handleDayClick(day, false)}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Cultural Event</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Festival</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Selected Day</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                <span className="text-sm text-gray-600">Other Month</span>
              </div>
            </div>
          </div>
        </section>

        {/* Calendar Events Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{getEventsSectionTitle()}</h2>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <span>Show all month events</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
          
          {loading ? (
            <p className="text-center text-gray-600 py-8">Loading events...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-8">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getMonthEvents().map((event) => (
                  <EventcardTracking 
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    time={event.time || "TBA"}
                    starting_point={event.starting_point || "TBA"}
                    route={event.route || "TBA"}
                    description={event.description}
                    image={event.image}
                  />
                ))}
              </div>
              
              {getMonthEvents().length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {selectedDay 
                      ? `No events scheduled for ${new Date(currentYear, currentMonthIndex, selectedDay).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}` 
                      : `No events scheduled for ${currentMonth}`}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try selecting a different day or month to discover upcoming cultural events and festivals.
                  </p>
                </div>
              )}
            </>
          )}

        
        </section>
      </div>
    </div>
  );
};

export default EventTracking;