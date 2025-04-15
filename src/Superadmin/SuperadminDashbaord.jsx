import React from 'react';


export default function SuperadminDashboard() {

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 py-3 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Django administration</h1>
        <div className="flex items-center space-x-4 text-sm">
          <span>WELCOME, ADMIN1@GMAIL.COM</span>
          <div className="flex space-x-2">
            <a href="#" className="hover:underline">VIEW SITE</a>
            <span>/</span>
            <a href="#" className="hover:underline">CHANGE PASSWORD</a>
            <span>/</span>
            <a href="#" className="hover:underline">LOG OUT</a>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-gray-800 text-gray-300 px-6 py-2 text-sm">
        <nav className="flex">
          <a href="#" className="hover:text-white">Home</a>
          <span className="mx-2">/</span>
          <a href="#" className="hover:text-white">Posts</a>
          <span className="mx-2">/</span>
          <span>Posts</span>
        </nav>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 p-4">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Start typing to filter..." 
              className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded"
            />
          </div>

          {/* Sidebar sections */}
          <div className="mb-4">
            <div className="bg-blue-600 text-white p-2 uppercase text-sm font-bold">
              Auth Token
            </div>
            <div className="bg-gray-800 p-2">
              <div className="flex justify-between items-center">
                <span>Tokens</span>
                <button className="text-green-400">+ Add</button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-blue-600 text-white p-2 uppercase text-sm font-bold">
              Authentication and Authorization
            </div>
            <div className="bg-gray-800 p-2">
              <div className="flex justify-between items-center">
                <span>Groups</span>
                <button className="text-green-400">+ Add</button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-blue-600 text-white p-2 uppercase text-sm font-bold">
              Events
            </div>
            <div className="bg-gray-800 p-2">
              <div className="flex justify-between items-center">
                <span>Events</span>
                <button className="text-green-400">+ Add</button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-blue-600 text-white p-2 uppercase text-sm font-bold">
              Posts
            </div>
            <div className="bg-gray-800 p-2">
              <div className="flex justify-between items-center">
                <span>Posts</span>
                <button className="text-green-400">+ Add</button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-blue-600 text-white p-2 uppercase text-sm font-bold">
              Users
            </div>
            <div className="bg-gray-800 p-2">
              <div className="flex justify-between items-center">
                <span>Users</span>
                <button className="text-green-400">+ Add</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        
        </div>
      </div>
    
  );
}