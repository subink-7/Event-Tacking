import React, { useState } from 'react';
import { 
  FaPencilAlt, 
  FaTrashAlt, 
  FaPlus, 
  FaCheck, 
  FaTimes 
} from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UsersPanel = ({ users, setUsers, loading, error }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem 
        ? `http://localhost:8000/users/api/customuser/${editingItem.id}/` 
        : 'http://localhost:8000/users/api/customuser/';
      
      const method = editingItem ? 'put' : 'post';
      
      const response = await axios[method](url, formData);
      
      setUsers(editingItem 
        ? users.map(user => user.id === editingItem.id ? response.data : user)
        : [...users, response.data]);
  
      // Show success toast
      toast.success(`User ${editingItem ? 'updated' : 'created'} successfully!`);
      
   
      setEditingItem(null);
      setIsCreating(false);
      setFormData({});
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} user: ${err.message}`);
    }
  };


  const handleDelete = (id) => {
    const userToDelete = users.find(user => user.id === id);
    if (!userToDelete) return;
    
   
    const toastId = `confirm-delete-${id}`;
    
    toast.info(
      <div>
        <p className="mb-2">Are you sure you want to delete user: <strong>{userToDelete.email}</strong>?</p>
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
      await axios.delete(`http://localhost:8000/users/api/customuser/${id}/`);
      setUsers(users.filter(user => user.id !== id));
      
      // Dismiss the confirmation toast
      toast.dismiss(toastId);
      
      // Show success toast for deletion
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.dismiss(toastId);
      toast.error(`Failed to delete user: ${err.message}`);
    }
  };

  // Handler for edit button click
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsCreating(false);
  };

  // Handler for add button click
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsCreating(true);
  };

  // Handler for cancel button click
  const handleCancel = () => {
    setEditingItem(null);
    setIsCreating(false);
    setFormData({});
  };

  // Form fields for user
  const renderFormFields = () => (
    <>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="email">Email</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded"
          type="email" 
          id="email"
          name="email" 
          value={formData.email || ''} 
          onChange={handleInputChange} 
          required 
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="name">Name</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded"
          type="text" 
          id="name"
          name="name" 
          value={formData.name || ''} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="role">Role</label>
        <select 
          className="w-full p-3 border border-gray-300 rounded bg-white"
          id="role"
          name="role" 
          value={formData.role || 'USER'} 
          onChange={handleInputChange}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPERADMIN">Superadmin</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="address">Address</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded"
          type="text" 
          id="address"
          name="address" 
          value={formData.address || ''} 
          onChange={handleInputChange} 
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium" htmlFor="phonenumber">Phone Number</label>
        <input 
          className="w-full p-3 border border-gray-300 rounded"
          type="text" 
          id="phonenumber"
          name="phonenumber" 
          value={formData.phonenumber || ''} 
          onChange={handleInputChange} 
        />
      </div>
      {!editingItem && (
       <div className="mb-4">
       <label className="block mb-2 font-medium" htmlFor="password">
         Password {!editingItem ? '(required)' : '(leave blank to keep current)'}
       </label>
       <input 
         className="w-full p-3 border border-gray-300 rounded"
         type="password" 
         id="password"
         name="password" 
         value={formData.password || ''} 
         onChange={handleInputChange} 
         required={!editingItem} 
       />
     </div>
      )}
    </>
  );

  // Render users table
  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">ID</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Email</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Name</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Role</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Address</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Phone</th>
            <th className="p-3 text-left font-medium text-gray-600 border border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr 
              key={user.id} 
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="p-3 border border-gray-200">{user.id}</td>
              <td className="p-3 border border-gray-200">{user.email}</td>
              <td className="p-3 border border-gray-200">{user.name || 'N/A'}</td>
              <td className="p-3 border border-gray-200">{user.role || 'USER'}</td>
              <td className="p-3 border border-gray-200">{user.address || 'N/A'}</td>
              <td className="p-3 border border-gray-200">{user.phonenumber || 'N/A'}</td>
              <td className="p-3 border border-gray-200">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(user)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <FaPencilAlt className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
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

      <div className="flex justify-end mb-4">
        <button 
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={handleAdd}
        >
          <FaPlus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {loading ? (
        <div className="h-48 flex justify-center items-center text-gray-500 text-lg">
          Loading...
        </div>
      ) : isCreating || editingItem ? (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingItem ? 'Edit' : 'Create'} User
          </h3>
          <form onSubmit={handleSubmit}>
            {renderFormFields()}
            <div className="flex space-x-4 mt-6">
              <button 
                type="submit" 
                className="flex items-center space-x-2 px-5 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaCheck className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button 
                type="button" 
                className="flex items-center space-x-2 px-5 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                onClick={handleCancel}
              >
                <FaTimes className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        renderTable()
      )}
    </div>
  );
};

export default UsersPanel;