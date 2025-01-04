
import Input from './Input';  // No need to include 'components/' in the path
import Button from './Button'; // Same as above
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export function LoginForm() {
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get all the form fields
    setError(null); // Clear error if form is valid
    alert("Sucessfully Logiin!");

    // Add form submission logic here (e.g., send form data to the server)

    // Navigate to the login page after form submission
    navigate("/eventpage"); // Replace with the actual login page route
  };

  return (
    <div
      className="flex items-center justify-center py-16 px-5"
      style={{
        backgroundColor: "rgba(255, 165, 0, 0.1)", // Optional background for the outer div
      }}
    >
      <div
       onSubmit={handleSubmit}
        className="flex flex-col justify-center px-20 py-28 border border-white rounded-lg shadow-lg bg-opacity-80 min-w-[240px] w-[500px] max-md:px-5 max-md:py-24"
        style={{
          backgroundImage: "url('/photos/katmandu.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay",
        }}
      >
        <form className="flex flex-col w-full" onSubmit={(e) => e.preventDefault()}>
          <h1 className="text-2xl font-bold text-center text-orange-700 bg-opacity-70 rounded p-2">
            Login
          </h1>
          {error && (
          <div className="mt-4 p-4 bg-red-500 text-white text-center rounded-lg shadow-lg">
            {error}
          </div>
        )}
          <div className="flex flex-col mt-8 w-full gap-4">
            <Input
              label="Email"
              type="email"
              id="email"
            />
            <Input
              label="Password"
              type="password"
              id="password"
            />
          </div>
          <div className="flex flex-col mt-16 w-full max-md:mt-10">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
