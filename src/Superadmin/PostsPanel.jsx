import React, { useState, useEffect } from 'react';
import { 
  FaPencilAlt, 
  FaTrashAlt, 
  FaPlus, 
  FaCheck, 
  FaTimes, 
  FaUser, 
  FaCalendarAlt 
} from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostsPanel = ({ posts: initialPosts, setPosts, users, events, loading: initialLoading, error: initialError }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [viewMode, setViewMode] = useState('all'); 
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);
  const [localPosts, setLocalPosts] = useState(initialPosts || []);

  const BASE_URL = 'http://localhost:8000/';

  // Get JWT token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;
      
      const response = await axios.post(`${BASE_URL}api/token/refresh/`, {
        refresh: refreshToken
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      if (response.status !== 200) return false;
  
      localStorage.setItem("accessToken", response.data.access);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };
  
 
  const fetchWithAuth = async (url, options = {}) => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      toast.error("Not authenticated - Please login again");
      throw new Error("Not authenticated - Please login again");
    }

    try {
      const config = {
        ...options,
        headers: {
          ...options.headers,
          ...authHeader,
        },
      };

      const response = await axios(url, config);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshToken();
        if (refreshed) {
          // Update the headers with new token
          const newAuthHeader = getAuthHeader();
          const newConfig = {
            ...options,
            headers: {
              ...options.headers,
              ...newAuthHeader,
            },
          };
          return axios(url, newConfig);
        }
        toast.error("Session expired. Please login again.");
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  };


  useEffect(() => {
    const loadData = async () => {
      if (initialPosts) return;
      
      try {
        setLoading(true);
        const postsResponse = await fetchWithAuth(`${BASE_URL}posts/feedback/`);
        setLocalPosts(postsResponse.data);
        if (setPosts) setPosts(postsResponse.data);
        toast.success("Posts loaded successfully");
      } catch (err) {
        console.error("Error loading posts:", err);
        setError(err.message);
        toast.error(`Error loading posts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

 
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
        ? `${BASE_URL}posts/feedback/post/${editingItem.id}/` 
        : (formData.event 
           ? `${BASE_URL}posts/feedback/${formData.event}/` 
           : `${BASE_URL}posts/feedback/`);
      
      const method = editingItem ? 'put' : 'post';
      
      
      const data = new FormData();
      
      
      if (formData.user) {
        data.append('user', formData.user);
        
        data.append('admin_override', 'true');
      }
      
      data.append('content', formData.content || '');
      
      
      if (formData.event) {
        data.append('event', formData.event);
      }
      
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }
      
      if (formData.is_approved !== undefined) {
        data.append('is_approved', formData.is_approved);
      }

      const response = await fetchWithAuth(url, {
        method: method,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      
      const updatedPost = {
        ...response.data,
        user_id: response.data.user,
        event_id: response.data.event?.id,
        title: response.data.content.substring(0, 30) + (response.data.content.length > 30 ? '...' : ''),
        image: response.data.image_url,
        created_at: response.data.created_at,
        is_approved: response.data.is_approved !== undefined ? response.data.is_approved : true
      };
      
      const updatedPosts = editingItem 
        ? localPosts.map(post => post.id === editingItem.id ? updatedPost : post)
        : [...localPosts, updatedPost];
      
      setLocalPosts(updatedPosts);
      if (setPosts) setPosts(updatedPosts);
  
     
      toast.success(editingItem ? "Post updated successfully" : "Post created successfully");
      
     
      setEditingItem(null);
      setIsCreating(false);
      setFormData({});
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

 
  const handleDelete = async (id) => {
   
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to delete this post?</p>
        <div className="flex justify-end mt-2 space-x-2">
          <button 
            onClick={() => {
              toast.dismiss(toastId);
              performDelete(id);
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button 
            onClick={() => toast.dismiss(toastId)}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false
      }
    );
  };

  
  const performDelete = async (id) => {
    try {
      await fetchWithAuth(`${BASE_URL}posts/feedback/post/${id}/`, {
        method: 'delete'
      });
      
      const updatedPosts = localPosts.filter(post => post.id !== id);
      setLocalPosts(updatedPosts);
      if (setPosts) setPosts(updatedPosts);
      
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.message);
      toast.error(`Error deleting post: ${err.message}`);
    }
  };


  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsCreating(false);
    toast.info("Editing post");
  };

 
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsCreating(true);
    toast.info("Adding new post");
  };

 
  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({});
    toast.info("Cancelled");
  };

  
  const filteredPosts = () => {
    switch(viewMode) {
      case 'approved':
        return localPosts.filter(post => post.is_approved);
      case 'pending':
        return localPosts.filter(post => !post.is_approved);
      default:
        return localPosts;
    }
  };

  
  useEffect(() => {
    if (error && error.includes("Authentication")) {
      toast.error("Authentication error: Please login again");
      
      // window.location.href = '/login';
    }
  }, [error]);


  const getEventName = (eventId) => {
    const event = events.find(e => e.id === Number(eventId));
    return event ? event.title : `Event ${eventId}`;
  };

  const renderFormFields = () => (
    <>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="user">User <span className="text-red-500">*</span></label>
        <select 
          className="w-full p-3 border border-gray-300 rounded"
          id="user"
          name="user" 
          value={formData.user || formData.user_id || ''} 
          onChange={handleInputChange} 
          required
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.email} ({user.first_name} {user.last_name})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="event">Related Event</label>
        <select 
          className="w-full p-3 border border-gray-300 rounded"
          id="event"
          name="event" 
          value={formData.event?.id || formData.event_id || ''} 
          onChange={handleInputChange}
        >
          <option value="">General Feedback </option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title} ({event.date})
            </option>
          ))}
        </select>
        {formData.event && (
          <p className="mt-1 text-sm text-blue-600">
            Selected event: {typeof formData.event === 'object' ? formData.event.title : getEventName(formData.event)}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="content">Content <span className="text-red-500">*</span></label>
        <textarea 
          className="w-full p-3 border border-gray-300 rounded min-h-32 resize-y"
          id="content"
          name="content" 
          value={formData.content || ''} 
          onChange={handleInputChange} 
          rows="6"
          required
        />
      </div>
    
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="image">Image</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded"
          type="file" 
          id="image"
          name="image" 
          onChange={handleInputChange} 
        />
        {formData.image_url && typeof formData.image_url === 'string' && (
          <div className="mt-2">
            <img src={formData.image_url} alt="Post" className="h-32 object-cover rounded" />
          </div>
        )}
      </div>
    </>
  );

  // Render posts table
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">ID</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Title</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">User</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Event</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Created</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts().map(post => {
            // Find user and event details
            const user = users.find(u => u.id === (post.user_id || post.user));
            const event = post.event || events.find(e => e.id === post.event_id);
            
            // Create a title from content if title is missing
            const displayTitle = post.title || (post.content && post.content.substring(0, 30) + (post.content.length > 30 ? '...' : ''));
            
            return (
              <tr 
                key={post.id} 
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-3 border border-gray-200">{post.id}</td>
                <td className="p-3 border border-gray-200">{displayTitle}</td>
                <td className="p-3 border border-gray-200">
                  {post.user_detail ? 
                    `${post.user_detail.email}` : 
                    (user ? `${user.first_name || ''} ${user.last_name || ''}` : 'Unknown User')}
                </td>
                <td className="p-3 border border-gray-200">
                  {event ? (typeof event === 'object' ? event.title : getEventName(event)) : 'General Feedback'}
                </td>
                
                <td className="p-3 border border-gray-200">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 border border-gray-200">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(post)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Edit"
                    >
                      <FaPencilAlt className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                      title="Delete"
                    >
                      <FaTrashAlt className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Main render
  if (loading) {
    return <div className="flex justify-center p-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  // Show form when adding or editing
  if (isCreating || editingItem) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editingItem ? 'Edit Post' : 'Add Post'}
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
              {editingItem ? 'Update' : 'Save'}
            </button>
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
                if (!editingItem) {
                  setFormData({});
                }
              }}
            >
              Save and add another
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Default view - table with posts
  return (
    <div className="bg-white rounded-lg shadow">
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
      />
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-lg font-medium">All Posts</h2>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="h-4 w-4" />
          <span>Add Post</span>
        </button>
      </div>
      
      {filteredPosts().length > 0 ? renderTable() : (
        <div className="p-8 text-center text-gray-500">
          No posts found. Click "Add Post" to create one.
        </div>
      )}
    </div>
  );
};

export default PostsPanel;