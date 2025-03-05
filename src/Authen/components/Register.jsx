"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi"

export default function Register() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isImageClicked, setIsImageClicked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setError("")

    try {
      const response = await fetch("http://localhost:8000/users/api/customuser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name: fullName, email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("API Response:", data)

        // Redirect to login page after successful registration
        navigate("/login")
      } else {
        const errorData = await response.json()
        setError(errorData.error_message || "Registration failed. Please try again.")
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
        {/* Left side image - enhanced with overlay text */}
        <motion.div
          className={`w-1/2 bg-cover bg-center relative cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out ${isImageClicked ? "scale-105" : ""}`}
          style={{
            backgroundImage: "url('/photos/katmandu.jpg')",
          }}
          onClick={() => setIsImageClicked(!isImageClicked)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-l-3xl"></div>
          <div className="z-10 text-white max-w-xs p-6">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight leading-tight">Track Your Journey</h1>
            <p className="text-white/80 font-light tracking-wide">
              Join our community of explorers and never miss an adventure.
            </p>
          </div>
        </motion.div>

        {/* Right side form - improved typography and spacing */}
        <motion.div
          className="w-1/2 flex flex-col justify-center items-center p-12 bg-white"
          onClick={handleTextClick}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 tracking-tight mt-2">Event Tracking System</h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-gray-600">
              <FiUserPlus className="text-[#6CB472]" />
              <p className="font-medium">Create your account</p>
            </div>
          </div>

          <form className="w-full max-w-md space-y-5" onSubmit={handleRegister}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-center bg-red-50 p-4 rounded-lg border border-red-100 shadow-sm"
              >
                <p className="font-medium">{error}</p>
              </motion.div>
            )}

            {/* Full Name input - improved styling */}
            <div className="relative group">
              <FiUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#6CB472] transition-colors duration-200" />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-10 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CB472] transition-all duration-300 font-medium placeholder:font-normal"
              />
            </div>

            {/* Email input - improved styling */}
            <div className="relative group">
              <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#6CB472] transition-colors duration-200" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-10 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CB472] transition-all duration-300 font-medium placeholder:font-normal"
              />
            </div>

            {/* Password input - improved styling */}
            <div className="relative group">
              <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#6CB472] transition-colors duration-200" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-10 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CB472] transition-all duration-300 font-medium placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <FiEyeOff className="text-[#6CB472]" /> : <FiEye />}
              </button>
            </div>

            {/* Confirm Password input - improved styling */}
            <div className="relative group">
              <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#6CB472] transition-colors duration-200" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-10 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6CB472] transition-all duration-300 font-medium placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <FiEyeOff className="text-[#6CB472]" /> : <FiEye />}
              </button>
            </div>

            {/* Submit button - enhanced styling */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full px-6 py-3.5 mt-2 bg-gradient-to-r from-[#6CB472] to-[#4A8C5F] text-white rounded-lg hover:from-[#5CA362] hover:to-[#3A7C4F] transition-all duration-300 shadow-lg font-semibold tracking-wide"
            >
              Create Account
            </motion.button>
          </form>

          <p className="mt-8 text-sm text-gray-600 font-medium">
            Already have an account?{" "}
            <a href="/login" className="text-[#6CB472] hover:underline font-semibold">
              Log in here
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

