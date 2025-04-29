import React, { useState, useEffect } from 'react';
import { Bell, Check, AlertTriangle, Clock } from 'lucide-react';
import { clearAllNotifications, removeNotification, selectNotifications } from '../../services/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from './Header';

export default function Notification() {
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);
  
  

 
  const getIconByType = (type) => {
    switch (type) {
      case 'cultural':
        return <Bell size={20} className="text-purple-500" />;
      case 'festival':
        return <Check size={20} className="text-green-500" />;
      case 'religious':
        return <Clock size={20} className="text-yellow-500" />;
      case 'major-festival':
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  
  const getBackgroundByType = (type) => {    
    switch (type) {
      case 'cultural':
        return "bg-purple-50";
      case 'festival':
        return "bg-green-50";
      case 'religious':
        return "bg-yellow-50";
      case 'major-festival':
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

 
  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id));
  };

  
  const clearAll = () => {
    dispatch(clearAllNotifications());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 font-sans pb-12 relative">
      <div className="relative z-10 w-full bg-white/80 backdrop-blur-sm shadow-sm">
              <Header/>
            </div>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-10">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bell size={24} className="text-white" />
            <h1 className="text-2xl font-bold text-white">Event Notifications</h1>
            {notifications.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <button 
              onClick={clearAll}
              className="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md text-sm text-white transition duration-200"
            >
              Clear all
            </button>
          )}
        </div>
        
        {notifications.length > 0 ? (
          <div className="mt-4 px-6 pb-6">
            <div className="space-y-3">
              {notifications.map(event => (
                <div 
                  key={event.id} 
                  className={`flex justify-between items-center p-3 ${getBackgroundByType(event.type)} rounded-md`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getIconByType(event.type)}
                    </div>
                    
                    {event.image && (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveNotification(event.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center">
            <Bell size={48} className="text-gray-300" />
            <p className="mt-4 text-gray-500 text-lg">No notifications</p>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}