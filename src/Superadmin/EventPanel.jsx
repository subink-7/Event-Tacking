import React, { useState } from 'react';
import { 
  FaPencilAlt, 
  FaTrashAlt, 
  FaPlus, 
  FaCheck, 
  FaTimes, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventsPanel = ({ events, setEvents, loading, error }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});

 
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0] 
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem 
        ? `http://localhost:8000/events/${editingItem.id}/` 
        : 'http://localhost:8000/events/';
      
      const method = editingItem ? 'put' : 'post';
      
     
      const data = new FormData();
      
    
      Object.keys(formData).forEach(key => {
        
        if (key === 'image') {
          if (formData[key] instanceof File) {
           
            data.append(key, formData[key]);
          } else if (editingItem && typeof formData[key] === 'string' && formData[key] !== editingItem.image) {
         
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios[method](url, data, config);
      
    
      setEvents(editingItem 
        ? events.map(event => event.id === editingItem.id ? response.data : event)
        : [...events, response.data]);

      // Reset form state
      setEditingItem(null);
      setIsCreating(false);
      setFormData({});
      
     
      toast.success(editingItem ? "Event updated successfully!" : "Event created successfully!");
      
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(`Error: ${err.response?.data?.detail || "Failed to process your request"}`);
    }
  };

  
  const handleDelete = (id) => {
    const eventToDelete = events.find(event => event.id === id);
    if (!eventToDelete) return;
    
    
    const toastId = `confirm-delete-${id}`;
    
    toast.info(
      <div>
        <p className="mb-2">Are you sure you want to delete event: <strong>{eventToDelete.title}</strong>?</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => toast.dismiss(toastId)}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => confirmDelete(id, toastId)}
          >
            Delete
          </button>
        </div>
      </div>,
      {
        toastId,
        autoClose: false,
        closeOnClick: false,
        closeButton: false
      }
    );
  };


  const confirmDelete = async (id, toastId) => {
    try {
      await axios.delete(`http://localhost:8000/events/${id}/`);
      setEvents(events.filter(event => event.id !== id));
      
     
      toast.dismiss(toastId);
      
    
      toast.success('Event deleted successfully!');
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.dismiss(toastId);
      
      if (err.response && err.response.status === 404) {
       
        toast.warning("Event not found. It may have been already deleted.");
        
        setEvents(events.filter(event => event.id !== id));
      } else {
        toast.error(`Failed to delete event: ${err.message}`);
      }
    }
  };

  
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsCreating(false);
  };

  
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsCreating(true);
  };

  
  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({});
  };

  // Form fields for event
  const renderFormFields = () => (
    <>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="title">Title</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded"
          type="text" 
          id="title"
          name="title" 
          value={formData.title || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="description">Description</label>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded min-h-32 resize-y"
          id="description"
          name="description" 
          value={formData.description || ''} 
          onChange={handleInputChange} 
          rows="4"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="date">Date</label>
          <input 
            className="w-full p-3 border border-gray-300 rounded"
            type="date" 
            id="date"
            name="date" 
            value={formData.date || ''} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="time">Time</label>
          <input 
            className="w-full p-3 border border-gray-300 rounded"
            type="time" 
            id="time"
            name="time" 
            value={formData.time || ''} 
            onChange={handleInputChange} 
            required 
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="starting_point">Starting Point</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded"
          type="text" 
          id="starting_point"
          name="starting_point" 
          value={formData.starting_point || ''} 
          onChange={handleInputChange} 
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="route">Route</label>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded"
          id="route"
          name="route" 
          value={formData.route || ''} 
          onChange={handleInputChange} 
          rows="2"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="latitude">Latitude</label>
          <input 
            className="w-full p-3 border border-gray-300 rounded"
            type="text" 
            id="latitude"
            name="latitude" 
            value={formData.latitude || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="longitude">Longitude</label>
          <input 
            className="w-full p-3 border border-gray-300 rounded"
            type="text" 
            id="longitude"
            name="longitude" 
            value={formData.longitude || ''} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center">
          <input 
            className="mr-2 h-5 w-5"
            type="checkbox" 
            id="notifications_sent"
            name="notifications_sent" 
            checked={formData.notifications_sent || false} 
            onChange={handleInputChange} 
          />
          <label className="font-medium" htmlFor="notifications_sent">Notifications Sent</label>
        </div>
      </div>
      {formData.notifications_sent && (
        <div className="mb-4">
          <label className="block mb-2 font-medium" htmlFor="notification_date">Notification Date</label>
          <input 
            className="w-full p-3 border border-gray-300 rounded"
            type="datetime-local" 
            id="notification_date"
            name="notification_date" 
            value={formData.notification_date ? new Date(formData.notification_date).toISOString().slice(0, 16) : ''} 
            onChange={handleInputChange} 
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="image">Image</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded"
          type="file" 
          id="image"
          name="image" 
          onChange={handleInputChange} 
        />
        {formData.image && typeof formData.image === 'string' && (
          <div className="mt-2">
            <img src={formData.image} alt="Event" className="h-32 object-cover rounded" />
          </div>
        )}
      </div>
    </>
  );

  // Render events table
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">ID</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Title</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Date</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Time</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Starting Point</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Image</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr 
              key={event.id} 
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="p-3 border border-gray-200">{event.id}</td>
              <td className="p-3 border border-gray-200">{event.title}</td>
              <td className="p-3 border border-gray-200">{event.date}</td>
              <td className="p-3 border border-gray-200">{event.time}</td>
              <td className="p-3 border border-gray-200">{event.starting_point}</td>
              <td className="p-3 border border-gray-200">
                {event.image && (
                  <img src={event.image} alt="Event" className="h-10 w-10 object-cover rounded" />
                )}
              </td>
              <td className="p-3 border border-gray-200">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(event)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <FaPencilAlt className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <FaTrashAlt className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Main render
  return (
    <div>
      {/* Toast Container */}
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
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="h-48 flex justify-center items-center text-gray-500 text-lg">
          Loading...
        </div>
      ) : isCreating || editingItem ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingItem ? 'Edit Event' : 'Add New Event'}
            </h2>
            <button 
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {renderFormFields()}
            
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingItem ? 'Update' : 'Create'} Event
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium">All Events</h2>
            <button 
              onClick={handleAdd}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaPlus className="h-4 w-4" />
              <span>Add Event</span>
            </button>
          </div>
          
          {events.length > 0 ? renderTable() : (
            <div className="p-8 text-center text-gray-500">
              No events found. Click "Add Event" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPanel;