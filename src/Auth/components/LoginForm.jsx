"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setrole] = useState("")

  const [error, setError] = useState("")
  const [isImageClicked, setIsImageClicked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }

    setError("")

    try {
      const response = await fetch("http://localhost:8000/users/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("API Response:", data) // Log the response to see its structure

        // Now using the correct keys for access_token and refresh_token
        if (data.access && data.refresh) {
          localStorage.setItem("accessToken", data.access)
          localStorage.setItem("refreshToken", data.refresh)
          localStorage.setItem("role", data.role)
          localStorage.setItem("userid", data.id)
          localStorage.setItem("name", data.name)
          localStorage.setItem("email", data.email)
         
          console.log("Storing token for user ID:", data.id);

          // Check user role and redirect accordingly

          if (data.role === "ADMIN") {
            navigate("/dashboard")
            console.log("UserRole",data.role)
          } else {
            navigate("/dashboard")
          }
        } else {
          setError("Invalid response structure. No access token found.")
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error_message || "Login failed. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again later.")
      console.error(err)
    }
  }

  const handleTextClick = () => {
    setIsImageClicked(false)
  }

  return (
    <div className="flex h-screen overflow-hidden items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-11/12 max-w-5xl h-4/5 bg-white flex items-stretch justify-between rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Left side image */}
        <motion.div
          className={`w-1/2 bg-cover bg-center relative cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out ${isImageClicked ? "scale-105" : ""}`}
          style={{
            backgroundImage: "url('/photos/katmandu.jpg')",
          }}
          onClick={() => setIsImageClicked(!isImageClicked)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent rounded-l-3xl"></div>
          <h1 className="text-5xl font-bold text-white z-10 drop-shadow-lg"></h1>
        </motion.div>

        {/* Right side form */}
        <motion.div
          className="w-1/2 flex flex-col justify-center items-center p-12 bg-white"
          onClick={handleTextClick}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-2 text-gray-800">Welcome Back</h2>
          <p className="mb-8 text-gray-600">Log in to your account</p>

          <form className="w-full max-w-md space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-center bg-red-100 p-3 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            {/* Email input */}
            <div className="relative">
              <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CB472] transition-all duration-300"
              />
            </div>

            {/* Password input */}
            <div className="relative">
              <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CB472] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#6CB472] to-[#4A8C5F] text-white rounded-lg hover:from-[#5CA362] hover:to-[#3A7C4F] transition-all duration-300 shadow-lg"
            >
              Log In
            </motion.button>
          </form>

          <p className="mt-8 text-sm text-gray-600">
            Forgot your password?{" "}
            <a href="#" className="text-[#6CB472] hover:underline">
              Reset it here
            </a>

          </p>
          <div className="mt-5">
          <a href="/" className="text-[#6CB472] ">
             <span className="text-red-500 mt-10">Don't have account?</span><span className="hover:underline">Register here</span> 
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}