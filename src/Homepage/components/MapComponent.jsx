"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, LayersControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Navigation } from 'lucide-react'

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  if (typeof window !== "undefined") {
    delete L.Icon.Default.prototype._getIconUrl
  }
}

// Custom marker icons
const createCustomIcon = (color, Icon) => {
  return L.divIcon({
    className: "custom-icon-container",
    html: `
      <div class="flex items-center justify-center w-10 h-10 -mt-5 -ml-5">
        <div class="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg">
          <div class="flex items-center justify-center w-6 h-6 rounded-full" style="background-color: ${color}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              ${
                Icon === "MapPin"
                  ? '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>'
                  : Icon === "Flag"
                    ? '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line>'
                    : '<polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>'
              }
            </svg>
          </div>
        </div>
        <div class="absolute -bottom-1 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-r-[8px] border-r-transparent" style="border-top-color: ${color}"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

// Component to automatically fit map to bounds
function FitBounds({ markers, polylinePoints }) {
  const map = useMap()

  useEffect(() => {
    if ((markers && markers.length > 1) || (polylinePoints && polylinePoints.length > 1)) {
      const points = polylinePoints || markers.map((marker) => marker.position)
      const bounds = L.latLngBounds(points)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers, polylinePoints, map])

  return null
}

// Calculate distance between two points in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

// Calculate total route distance and estimated time
function calculateRouteInfo(points) {
  if (!points || points.length < 2) return { distance: 0, duration: 0 }

  let totalDistance = 0

  for (let i = 0; i < points.length - 1; i++) {
    const [lat1, lon1] = points[i]
    const [lat2, lon2] = points[i + 1]
    totalDistance += calculateDistance(lat1, lon1, lat2, lon2)
  }

  // Assume average walking speed of 5 km/h
  const durationHours = totalDistance / 5
  const durationMinutes = Math.round(durationHours * 60)

  return {
    distance: totalDistance.toFixed(1),
    duration: durationMinutes,
  }
}

// Animated route component
function AnimatedRoute({ positions }) {
  const [displayedPoints, setDisplayedPoints] = useState([])
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)
  const durationMs = 1500 // Animation duration in milliseconds

  useEffect(() => {
    if (!positions || positions.length < 2) return

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / durationMs, 1)

      const pointCount = Math.floor(progress * positions.length)
      setDisplayedPoints(positions.slice(0, pointCount + 1))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    
    setDisplayedPoints([positions[0]])
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [positions])

  if (!displayedPoints.length) return null

  return (
    <>
    
      <Polyline positions={displayedPoints} color="#ffffff" weight={10} opacity={0.4} smoothFactor={1} />
   
      <Polyline positions={displayedPoints} color="#3b82f6" weight={5} opacity={0.9} smoothFactor={1} />
    
      {displayedPoints.length > 0 && (
        <Marker
          position={displayedPoints[displayedPoints.length - 1]}
          icon={L.divIcon({
            className: "animated-dot",
            html: `<div class="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}
        />
      )}
    </>
  )
}

// Weather effect overlay
function WeatherEffect({ type = "sunny" }) {
  const map = useMap()
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    if (type === "rainy") {
      // Create rain drops
      for (let i = 0; i < 100; i++) {
        const drop = document.createElement("div")
        drop.className = "absolute bg-blue-400 opacity-70 rounded-full"
        drop.style.width = "2px"
        drop.style.height = `${Math.random() * 10 + 10}px`
        drop.style.left = `${Math.random() * 100}%`
        drop.style.top = `${Math.random() * 100}%`
        drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`
        drop.style.animationDelay = `${Math.random() * 2}s`
        drop.style.animationIterationCount = "infinite"
        drop.style.animationName = "rain-fall"
        container.appendChild(drop)
      }
    } else if (type === "snowy") {
      // Create snowflakes
      for (let i = 0; i < 50; i++) {
        const flake = document.createElement("div")
        flake.className = "absolute bg-white rounded-full"
        const size = Math.random() * 5 + 2
        flake.style.width = `${size}px`
        flake.style.height = `${size}px`
        flake.style.left = `${Math.random() * 100}%`
        flake.style.top = `${Math.random() * 100}%`
        flake.style.opacity = `${Math.random() * 0.7 + 0.3}`
        flake.style.animationDuration = `${Math.random() * 5 + 3}s`
        flake.style.animationDelay = `${Math.random() * 5}s`
        flake.style.animationIterationCount = "infinite"
        flake.style.animationName = "snow-fall"
        container.appendChild(flake)
      }
    } else if (type === "sunny") {
      // Create sun rays
      const sunOverlay = document.createElement("div")
      sunOverlay.className = "absolute inset-0 bg-gradient-to-b from-yellow-200/20 to-transparent"
      container.appendChild(sunOverlay)
    }

    return () => {
      container.innerHTML = ""
    }
  }, [type])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-[400] overflow-hidden"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 400,
      }}
    />
  )
}

// Terrain visualization
function TerrainLayer() {
  return (
    <TileLayer
      url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png"
      attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      opacity={0.5}
    />
  )
}

// Time of day effect
function TimeOfDayEffect({ time = "day" }) {
  let overlayClass = ""

  switch (time) {
    case "sunset":
      overlayClass = "bg-gradient-to-b from-orange-300/30 to-purple-500/30"
      break
    case "night":
      overlayClass = "bg-indigo-900/40"
      break
    default:
      return null
  }

  return <div className={`absolute inset-0 pointer-events-none z-[399] ${overlayClass}`} />
}

/**
 * Enhanced Map Component with beautiful styling and effects
 * @param {Object} props 
 * @param {Array} props.center 
 * @param {Array} props.markers 
 * @param {Array} props.polylinePoints 
 * @param {string} props.height 
 * @param {string} props.mapStyle 
 * @param {string} props.timeOfDay 
 * @param {string} props.weather 
 * @param {boolean} props.animate 
 */
export function MapComponent({ 
  center, 
  markers, 
  polylinePoints, 
  height = "500px", 
  mapStyle = "standard", 
  timeOfDay = "day", 
  weather = "sunny", 
  animate = true 
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fixLeafletIcon()
  }, [])

  if (!isMounted) {
    return (
      <div style={{ height, width: "100%" }} className="bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

 
  const visibleMarkers = markers ? markers.filter((marker) => !marker.isRoutePoint) : []


  const routePoints = markers ? markers.map((marker) => marker.position) : polylinePoints

 
  const routeInfo = calculateRouteInfo(routePoints || [])

  // Map style URLs
  const mapStyles = {
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
    terrain: {
      url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    dark: {
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    },
    watercolor: {
      url: "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  }

  const selectedStyle = mapStyles[mapStyle]

  return (
    <div className="relative">
      <MapContainer center={center} zoom={13} style={{ height, width: "100%" }} className="rounded-xl z-0 shadow-xl">
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked={mapStyle === "standard"} name="Standard">
            <TileLayer url={mapStyles.standard.url} attribution={mapStyles.standard.attribution} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={mapStyle === "satellite"} name="Satellite">
            <TileLayer url={mapStyles.satellite.url} attribution={mapStyles.satellite.attribution} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={mapStyle === "terrain"} name="Terrain">
            <TileLayer url={mapStyles.terrain.url} attribution={mapStyles.terrain.attribution} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={mapStyle === "dark"} name="Dark">
            <TileLayer url={mapStyles.dark.url} attribution={mapStyles.dark.attribution} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={mapStyle === "watercolor"} name="Watercolor">
            <TileLayer url={mapStyles.watercolor.url} attribution={mapStyles.watercolor.attribution} />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="3D Terrain">
            <TerrainLayer />
          </LayersControl.Overlay>
        </LayersControl>

        {/* Auto-fit bounds to include all markers */}
        {routePoints && routePoints.length > 0 && <FitBounds markers={markers} polylinePoints={routePoints} />}

        {/* Time of day effect */}
        <TimeOfDayEffect time={timeOfDay} />

        {/* Weather effect */}
        <WeatherEffect type={weather} />

        {/* Route visualization */}
        {routePoints && routePoints.length > 1 && animate ? (
          <AnimatedRoute positions={routePoints} />
        ) : (
          routePoints &&
          routePoints.length > 1 && (
            <>
              {/* White outline for the route line */}
              <Polyline positions={routePoints} color="#ffffff" weight={8} opacity={0.4} smoothFactor={1} />

              {/* Main blue route line */}
              <Polyline
                positions={routePoints}
                color="#3b82f6" // Blue
                weight={5}
                opacity={0.9}
                smoothFactor={1}
              />
            </>
          )
        )}

        {/* Custom markers */}
        {visibleMarkers &&
          visibleMarkers.map((marker, idx) => {
            // Determine marker type and color
            let iconType = "MapPin"
            let iconColor = "#3b82f6" // Default blue

            if (marker.type === "start") {
              iconType = "Navigation"
              iconColor = "#10b981" // Green
            } else if (marker.type === "end") {
              iconType = "Flag"
              iconColor = "#ef4444" // Red
            } else if (idx === 0) {
              iconType = "Navigation"
              iconColor = "#10b981" // Green
            } else if (idx === visibleMarkers.length - 1) {
              iconType = "Flag"
              iconColor = "#ef4444" // Red
            }

            return (
              <Marker position={marker.position} key={idx} icon={createCustomIcon(iconColor, iconType)}>
                <Popup className="rounded-lg shadow-lg">
                  <div className="p-1">
                    {marker.title && (
                      <div className="font-medium text-gray-900">
                        {marker.index !== undefined && (
                          <span className="inline-flex items-center justify-center w-5 h-5 mr-2 text-xs text-white bg-blue-500 rounded-full">
                            {marker.index}
                          </span>
                        )}
                        {marker.title}
                      </div>
                    )}
                    {marker.description && <div className="text-gray-600 text-sm mt-1">{marker.description}</div>}
                  </div>
                </Popup>
              </Marker>
            )}
          )}
      </MapContainer>

      {/* Distance & Time info box with improved styling */}
      {routePoints && routePoints.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-white px-4 py-3 rounded-lg shadow-lg z-10 border border-gray-200">
          <div className="flex items-center">
            <div className="mr-3 text-blue-500">
              <Navigation size={18} />
            </div>
            <div>
              <div className="font-medium text-gray-800">{routeInfo.distance} km</div>
              <div className="text-sm text-gray-600">{routeInfo.duration} min</div>
            </div>
          </div>
        </div>
      )}

      {/* Map style selector
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
        <div className="p-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-200">Map Style</div>
        <div className="p-2 grid grid-cols-2 gap-1">
          {Object.keys(mapStyles).map((style) => (
            <button
              key={style}
              className={`px-2 py-1 text-xs rounded ${mapStyle === style ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => {
                // This would need to be handled by a state update in a real implementation
                console.log(`Change map style to ${style}`)
              }}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  )
}
