"use client"

import { useState } from "react"
import { Menu, Grid, User, Newspaper, Mic, Settings } from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div
      className={`h-screen ${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 border-r border-slate-700/50 shadow-lg flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700/50">
        <span className="text-lg font-bold flex items-center">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          {isOpen && <span className="text-slate-100 tracking-wide">In Nepal</span>}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md hover:bg-slate-700/50 transition-colors duration-200"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Menu className="text-green-400 hover:text-green-300 transition-colors" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 px-2 space-y-1.5 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <SidebarItem icon={<Grid size={20} />} label="Dashboard" isOpen={isOpen} active />
        <SidebarItem icon={<User size={20} />} label="Area of Interest" isOpen={isOpen} />
        <SidebarItem icon={<Newspaper size={20} />} label="News" isOpen={isOpen} />
        <SidebarItem icon={<Mic size={20} />} label="Podcast" isOpen={isOpen} />
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-700/50 pt-2 px-2 pb-4">
        <SidebarItem icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, isOpen, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group ${
        active
          ? "bg-gradient-to-r from-green-900/80 to-green-800/60 text-green-100 font-medium shadow-sm"
          : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
      }`}
    >
      <div
        className={`${active ? "text-green-400" : "text-slate-400 group-hover:text-green-400"} transition-colors duration-200`}
      >
        {icon}
      </div>
      {isOpen && (
        <span className={`truncate ${active ? "" : "group-hover:translate-x-0.5"} transition-transform duration-200`}>
          {label}
        </span>
      )}
    </div>
  )
}

