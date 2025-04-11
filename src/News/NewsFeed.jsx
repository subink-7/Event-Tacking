"use client"

import { useState, useMemo, useEffect } from "react"
import { CgProfile } from "react-icons/cg";
import { Header } from "../utils/components/Header";
import { Footer } from "../utils/components/Footer";

export default function NewsFeed() {
  const [posts, setPosts] = useState([])
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loadedImages, setLoadedImages] = useState({})
  const [username, setUsername] = useState("User")
  const [isReloading, setIsReloading] = useState(false);

  // Base URL for API and assets
  const BASE_URL = "http://localhost:8000/"

  // Credentials for authentication
  const userEmail = "khadkagokarna234@gmail.com"
  const userPassword = "subin123"

  // Create the Authorization header
  const authHeader = useMemo(() => {
    return "Basic " + btoa(userEmail + ":" + userPassword);
  }, [userEmail, userPassword]);

  // Get user name from localStorage on component mount
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  // Fetch posts and events on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, eventsResponse] = await Promise.all([
          fetch(`${BASE_URL}posts/feedback/`, {
            headers: { Authorization: authHeader },
          }),
          fetch(`${BASE_URL}events/`, {
            headers: { Authorization: authHeader },
          })
        ]);

        if (!postsResponse.ok || !eventsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [postsData, eventsData] = await Promise.all([
          postsResponse.json(),
          eventsResponse.json()
        ]);

        setPosts(postsData);
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, [authHeader]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      alert("Please select an event");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("event_id", selectedEvent.id);
      if (image) formData.append("image", image);

      const response = await fetch(`${BASE_URL}posts/feedback/${selectedEvent.id}/`, {
        method: "POST",
        headers: { Authorization: authHeader },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setContent("");
      setImage(null);
      setImagePreview(null);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback. Please try again.");
    }
  }

  // Function to get proper image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg";
    const cleanedUrl = imageUrl.replace(/^[\\/]+/, '');
    return imageUrl && !imageUrl.startsWith("http") ? `${BASE_URL}${cleanedUrl}` : imageUrl;
  }

  // Function to get display name
  const getDisplayName = (user) => {
    if (!user) return "Anonymous User";
    return user.username || 
           (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) || 
           user.first_name || 
           (user.email ? user.email.split('@')[0] : null) || 
           " User";
  }

  // Function to get user initial


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 max-w-md rounded-lg shadow-md">
          <div className="text-center text-red-500 font-medium">{error}</div>
          <button
  className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition flex items-center justify-center ${isReloading ? 'opacity-75' : ''}`}
  onClick={() => {
    setIsReloading(true);
    window.location.reload();
  }}
  disabled={isReloading}
>
  {isReloading ? (
    <>
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Reloading...
    </>
  ) : (
    'Try Again'
  )}
</button>
        </div>
      </div>
    )
  }

  return (
     <div className="min-h-screen bg-[#fcf9f5] font-sans">
          {/* Header */}
          <div className="relative z-10 w-full bg-white/80 backdrop-blur-sm shadow-sm">
            <Header/>
          </div>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Create Post Card */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-medium">{username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <select
                  className="w-full p-2 border rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedEvent ? selectedEvent.id : ""}
                  onChange={(e) => {
                    const eventId = e.target.value;
                    const event = events.find((event) => event.id.toString() === eventId);
                    setSelectedEvent(event);
                  }}
                >
                  <option value="">Select an event to post about</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title || event.name || `Event #${event.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-blue-500 resize-none text-lg"
              rows="3"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            {imagePreview && (
              <div className="relative mt-3 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-96 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="h-px bg-gray-200 my-4"></div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-gray-600 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Photo</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md flex items-center"
                disabled={!content.trim() || !selectedEvent}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                   <CgProfile className="h-10 w-10 text-blue-600"/>

                    <div>
                      <h3 className="font-semibold">
                      {username}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {post.created_at ? new Date(post.created_at).toLocaleString() : "Unknown date"}
                      </p>
                    </div>
                  </div>

                  {post.event && (
                    <div className="mb-3 text-sm bg-gray-50 p-2 rounded">
                      <span className="font-medium">Event: </span>
                      {post.event.title || post.event.name || `Event #${post.event.id}`}
                    </div>
                  )}

                  <p className="mb-3 whitespace-pre-line">{post.content}</p>
                </div>

                {post.image_url && (
                  <div className="w-full">
                    <img
                      src={getImageUrl(post.image_url)}
                      alt="Post attachment"
                      className={`w-full max-h-[500px] object-cover ${
                        loadedImages[post.id] ? 'opacity-100' : 'opacity-0'
                      } transition-opacity duration-300`}
                      onLoad={() => setLoadedImages(prev => ({...prev, [post.id]: true}))}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                        setLoadedImages(prev => ({...prev, [post.id]: true}));
                      }}
                    />
                  </div>
                )}

                {/* Comment input section */}
               
              </div>
            ))
          ) : (
            <div className="bg-white p-8 text-center rounded-lg shadow-md">
              <div className="text-gray-500">No posts yet. Be the first to share your feedback!</div>
            </div>

            

          )}

            
        </div>
      </main>
    </div>
  )
}