import React from 'react'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
useEffect(() => {
    // Fetch posts from your Django API
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/posts/');
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSelectPost = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(postId => postId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(posts.map(post => post.id));
    } else {
      setSelected([]);
    }
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const executeAction = () => {
    if (!action || selected.length === 0) return;
    
    // Implement your action logic here based on the action value
    console.log(`Executing action: ${action} on posts:`, selected);
    
    // Example: if action is 'delete', you would make an API call:
    // axios.post('/api/posts/bulk-delete/', { ids: selected });
  };

export default function SuperPost() {
      const [posts, setPosts] = useState([]);
      const [selected, setSelected] = useState([]);
      const [action, setAction] = useState('');
      const [loading, setLoading] = useState(true);
  return (

      <div className="flex-grow p-6 bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl">Select post to change</h2>
            <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded flex items-center">
              <span className="mr-1">ADD POST</span>
              <span>+</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center mb-4 text-sm">
            <span className="mr-2">Action:</span>
            <select 
              className="bg-gray-800 border border-gray-700 rounded p-1 mr-2"
              value={action}
              onChange={handleActionChange}
            >
              <option value="">---------</option>
              <option value="delete">Delete selected posts</option>
            </select>
            <button 
              onClick={executeAction}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-2 py-1 rounded"
            >
              Go
            </button>
            <span className="ml-4">{selected.length} of {posts.length} selected</span>
          </div>

          {/* Posts table */}
          <div className="bg-gray-800 rounded overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 w-8">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll} 
                      checked={selected.length > 0 && selected.length === posts.length}
                    />
                  </th>
                  <th className="p-3 uppercase text-xs font-bold">POST</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="2" className="p-3 text-center">Loading...</td></tr>
                ) : posts.length === 0 ? (
                  <tr><td colSpan="2" className="p-3 text-center">No posts found</td></tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-3">
                        <input 
                          type="checkbox" 
                          checked={selected.includes(post.id)}
                          onChange={() => handleSelectPost(post.id)}
                        />
                      </td>
                      <td className="p-3">
                        <a href="#" className="text-blue-400 hover:underline">
                          {post.content ? (
                            post.content.length > 50 ? 
                            `${post.content.substring(0, 50)}...` : 
                            post.content
                          ) : (
                            `None's post about ${post.event_title || 'Event'}`
                          )}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          <div className="mt-4 text-sm">
            {posts.length} posts
          </div>
    </div>
  )
}
