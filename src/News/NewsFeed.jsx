"use client"

import { useState, useEffect, useRef } from "react"

import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa"

import { Header } from "../utils/components/Header"
import { Footer } from "../utils/components/Footer"


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
  const [isReloading, setIsReloading] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [activeCommentPost, setActiveCommentPost] = useState(null)
  const [showLikersTooltip, setShowLikersTooltip] = useState(null)
  const [likersList, setLikersList] = useState({})

  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [postsPerPage] = useState(5)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  

  const observerRef = useRef(null)
  const lastPostRef = useRef(null)

  
  const BASE_URL = "http://localhost:8000/"

  // Get JWT token from localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken")
    return token ? { Authorization: `Bearer ${token}` } : null
  }

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) return false
      
      const response = await fetch(`${BASE_URL}api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })
  
      if (!response.ok) return false
  
      const data = await response.json()
      localStorage.setItem("accessToken", data.access)
      return true
    } catch (error) {
      console.error("Token refresh failed:", error)
      return false
    }
  }
  
  // Fetch data with authentication
  const fetchWithAuth = async (url, options = {}) => {
    const authHeader = getAuthHeader()
    if (!authHeader) {
      throw new Error("Not authenticated - Please login again")
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          ...authHeader,
        },
      })

      if (response.status === 401) {
        
        const refreshed = await refreshToken()
        if (refreshed) {
          return fetchWithAuth(url, options) 
        }
        throw new Error("Session expired. Please login again.")
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      return response
    } catch (error) {
      console.error("Fetch error:", error)
      throw error
    }
  }


  useEffect(() => {
    const storedName = localStorage.getItem("name")
    if (storedName) {
      setUsername(storedName)
    }
  }, [])

 
  useEffect(() => {
    if (!hasMorePosts) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current = observer;
    
    if (lastPostRef.current) {
      observer.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [posts, isLoadingMore, hasMorePosts]);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [postsResponse, eventsResponse] = await Promise.all([
          fetchWithAuth(`${BASE_URL}posts/feedback/`),
          fetchWithAuth(`${BASE_URL}events/`),
        ])

        const [postsData, eventsData] = await Promise.all([
          postsResponse.json(),
          eventsResponse.json(),
        ])

        setAllPosts(postsData)
        
      
        const initialPosts = postsData.slice(0, postsPerPage)
        setPosts(initialPosts)
        setHasMorePosts(postsData.length > postsPerPage)
        
        setEvents(eventsData)
      } catch (error) {
        setError(error.message)
        console.error("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])


  const loadMorePosts = () => {
    if (!hasMorePosts || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    const nextPage = currentPage + 1;
    const startIndex = currentPage * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const nextPosts = allPosts.slice(startIndex, endIndex);
    
    if (nextPosts.length > 0) {
      setPosts(prevPosts => [...prevPosts, ...nextPosts]);
      setCurrentPage(nextPage);
      setHasMorePosts(endIndex < allPosts.length);
    } else {
      setHasMorePosts(false);
    }
    
    setIsLoadingMore(false);
  };

 
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedEvent) {
      alert("Please select an event")
      return
    }

    if (!content.trim()) {
      alert("Please enter some content")
      return
    }

    try {
      const formData = new FormData()
      formData.append("content", content)
      if (image) formData.append("image", image)

      const response = await fetchWithAuth(
        `${BASE_URL}posts/feedback/${selectedEvent.id}/`,
        {
          method: "POST",
          body: formData,
        }
      )

      const newPost = await response.json()
      
    
      setAllPosts(prevPosts => [newPost, ...prevPosts])
      setPosts(prevPosts => [newPost, ...prevPosts])
      
      setContent("")
      setImage(null)
      setImagePreview(null)
      setSelectedEvent(null)
    } catch (error) {
      alert(`Post failed: ${error.message}`)
      console.error("Post error:", error)
    }
  }


const fetchLikesDetails = async (postId) => {
  if (likersList[postId]) {
    return likersList[postId] 
  }
  
  try {
    const response = await fetchWithAuth(`${BASE_URL}posts/feedback/${postId}/likes/`)
    const likesData = await response.json()
    
  
    const processedLikes = likesData.map(like => {
     
      if (like.user_detail) {
        return like.user_detail
      }
   
      return {
        id: like.user,
        username: null,
        first_name: null,
        last_name: null,
        email: `User ${like.user}` 
      }
    })
    
    
    setLikersList(prev => ({
      ...prev,
      [postId]: processedLikes
    }))
    
    return processedLikes
  } catch (error) {
    console.error("Fetch likes error:", error)
    return []
  }
}


const handleLike = async (postId) => {
  try {
    const response = await fetchWithAuth(
      `${BASE_URL}posts/feedback/${postId}/like/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

 
    const updatePostsInArray = (postsArray) => {
      return postsArray.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: post.likes_count + 1,
            is_liked_by_user: true
          }
        }
        return post
      })
    }

    setAllPosts(prevPosts => updatePostsInArray(prevPosts))
    setPosts(prevPosts => updatePostsInArray(prevPosts))
    

    setLikersList(prev => {
      const newList = {...prev}
      delete newList[postId]
      return newList
    })
  } catch (error) {
    console.error("Like error:", error)
    alert("Failed to like post")
  }
}


const handleUnlike = async (postId) => {
  try {
    await fetchWithAuth(
      `${BASE_URL}posts/feedback/${postId}/like/`,
      {
        method: "DELETE",
      }
    )

    
    const updatePostsInArray = (postsArray) => {
      return postsArray.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: post.likes_count > 0 ? post.likes_count - 1 : 0,
            is_liked_by_user: false
          }
        }
        return post
      })
    }
    
    setAllPosts(prevPosts => updatePostsInArray(prevPosts))
    setPosts(prevPosts => updatePostsInArray(prevPosts))
    

    setLikersList(prev => {
      const newList = {...prev}
      delete newList[postId]
      return newList
    })
  } catch (error) {
    console.error("Unlike error:", error)
    alert("Failed to unlike post")
  }
}

 
  const handlePostClick = (postId, isLiked) => {
    if (isLiked) {
      handleUnlike(postId)
    } else {
      handleLike(postId)
    }
  }

  
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return

    try {
      const response = await fetchWithAuth(
        `${BASE_URL}posts/feedback/${postId}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: commentText }),
        }
      )

      const newComment = await response.json()
      
      
      const updatePostsInArray = (postsArray) => {
        return postsArray.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), newComment]
            }
          }
          return post
        })
      }
      
      setAllPosts(updatePostsInArray)
      setPosts(updatePostsInArray)
      
      setCommentText("")
    } catch (error) {
      console.error("Comment error:", error)
      alert("Failed to add comment")
    }
  }

  // Function to fetch comments for a post
  const fetchComments = async (postId) => {
    try {
      const response = await fetchWithAuth(
        `${BASE_URL}posts/feedback/${postId}/comments/`
      )
      
      const comments = await response.json()
      
      // Update both allPosts and paginated posts
      const updatePostsInArray = (postsArray) => {
        return postsArray.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: comments
            }
          }
          return post
        })
      }
      
      setAllPosts(updatePostsInArray)
      setPosts(updatePostsInArray)
    } catch (error) {
      console.error("Fetch comments error:", error)
    }
  }

  // Function to toggle comment section
  const toggleComments = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null) 
    } else {
      setActiveCommentPost(postId) 
      fetchComments(postId) 
    }
  }


  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.svg"
    const cleanedUrl = imageUrl.replace(/^[\\/]+/, '')
    return imageUrl && !imageUrl.startsWith("http") ? `${BASE_URL}${cleanedUrl}` : imageUrl
  }

 
  const getDisplayName = (user) => {
    if (!user) return "Anonymous User"
    return user.username || 
           (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) || 
           user.first_name || 
           (user.email ? user.email.split('@')[0] : null) || 
           "User"
  }


  const handleLikesHover = async (postId) => {
    await fetchLikesDetails(postId)
    setShowLikersTooltip(postId)
  }

 
  const handleLikesLeave = () => {
    setShowLikersTooltip(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
              setIsReloading(true)
              window.location.reload()
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
      <div className="sticky top-0 z-10 w-full bg-white/90 backdrop-blur-sm shadow-sm">
        <Header/>
      </div>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
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
                    const eventId = e.target.value
                    const event = events.find((event) => event.id.toString() === eventId)
                    setSelectedEvent(event)
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
                    setImage(null)
                    setImagePreview(null)
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
            posts.map((post, index) => (
              <div 
                key={post.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                ref={index === posts.length - 1 ? lastPostRef : null}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {getDisplayName(post.user_detail).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {getDisplayName(post.user_detail) || username}
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
                  <div 
                    className="w-full relative cursor-pointer"
                    onClick={() => handlePostClick(post.id, post.is_liked_by_user)}
                  >
                    <img
                      src={getImageUrl(post.image_url)}
                      alt="Post attachment"
                      className={`w-full max-h-[500px] object-cover ${
                        loadedImages[post.id] ? 'opacity-100' : 'opacity-0'
                      } transition-opacity duration-300`}
                      onLoad={() => setLoadedImages(prev => ({...prev, [post.id]: true}))}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                        setLoadedImages(prev => ({...prev, [post.id]: true}))
                      }}
                    />
                    
                    {/* Double-click like animation */}
                    {post.is_liked_by_user && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaHeart className="text-red-500 text-6xl animate-pulse" />
                      </div>
                    )}
                  </div>
                )}

                {/* Like, likers tooltip and Comment buttons */}
                <div className="px-4 py-3 border-t flex items-center space-x-6">
                  <div className="relative">
                    <button 
                      onClick={() => post.is_liked_by_user ? handleUnlike(post.id) : handleLike(post.id)}
                      onMouseEnter={() => handleLikesHover(post.id)}
                      onMouseLeave={handleLikesLeave}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition"
                    >
                      {post.is_liked_by_user ? (
                        <FaHeart className="text-red-500 hover:scale-110 transition-transform" />
                      ) : (
                        <FaRegHeart className="hover:scale-110 transition-transform" />
                      )}
                      <span>{post.likes_count || 0} Likes</span>
                    </button>
                    
                   
                    {showLikersTooltip === post.id && post.likes_count > 0 && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 w-56 max-h-32 overflow-y-auto z-10">
                        <div className="text-sm font-medium mb-1 border-b pb-1">Liked by:</div>
                        <ul className="text-xs space-y-1">
                          {likersList[post.id] && likersList[post.id].length > 0 ? (
                            likersList[post.id].map((liker, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                  {getDisplayName(liker).charAt(0).toUpperCase()}
                                </div>
                                <span>{getDisplayName(liker)}</span>
                              </li>
                            ))
                          ) : (
                            <li>Loading likers...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition"
                  >
                    <FaComment className="hover:scale-110 transition-transform" />
                    <span>{post.comments?.length || 0} Comments</span>
                  </button>
                </div>

               
                {activeCommentPost === post.id && (
                  <div className="border-t px-4 py-3 bg-gray-50">
                    {/* Display comments */}
                    <div className="space-y-3 mb-3">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {getDisplayName(comment.user_detail).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 bg-white p-2 rounded-lg shadow-sm">
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-sm">
                                  {getDisplayName(comment.user_detail)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center">No comments yet</p>
                      )}
                    </div>

                    {/* Add comment form */}
                    <div className="flex space-x-2 mt-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 flex">
                        <input
                          type="text"
                          className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && commentText.trim()) {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                        />
                        <button
                          className="bg-blue-500 text-white px-3 rounded-r-lg hover:bg-blue-600 transition"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentText.trim()}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white p-8 text-center rounded-lg shadow-md">
              <div className="text-gray-500">No posts yet. Be the first to share your feedback!</div>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}