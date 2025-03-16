import React from 'react';

const CalendarCard= ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{event.title}</h3>
        <p className="text-red-600 text-sm mb-1">{event.date}</p>
        <p className="text-gray-600 text-sm">{event.location}</p>
        <p className="text-gray-700 mt-2">{event.description}</p>
        <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
};
export default CalendarCard;