import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { FormInput } from "./FormInput";

const formFields = [
  { id: "fullName", label: "Full Name", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "password", label: "Password", type: "password" },
  { id: "confirmPassword", label: "Confirm Password", type: "password" },
];

export function Register() {
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get all the form fields
    setError(null); // Clear error if form is valid
    alert("Form submitted successfully!");

    // Add form submission logic here (e.g., send form data to the server)

    // Navigate to the login page after form submission
    navigate("/login"); // Replace with the actual login page route
  };

  return (
    <div
      className="flex items-center justify-center py-16 px-5"
      style={{
        backgroundColor: "rgba(255, 165, 0, 0.1)", // Optional background for the outer div
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center px-20 py-28 border border-white rounded-lg shadow-lg bg-opacity-80 min-w-[240px] w-[500px] max-md:px-5 max-md:py-24"
        style={{
          backgroundImage: "url('/photos/katmandu.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay",
        }}
        aria-labelledby="register-title"
      >
        <h1
          id="register-title"
          className="text-2xl font-bold text-center text-orange-700 bg-opacity-70 rounded p-2"
        >
          Register
        </h1>

        {error && (
          <div className="mt-4 p-4 bg-red-500 text-white text-center rounded-lg shadow-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col mt-8">
          {formFields.map((field) => (
            <FormInput
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
            />
          ))}
        </div>

        <button
          type="submit"
          className="mt-16 px-12 py-3.5 bg-orange-700 rounded-lg text-white max-md:px-5"
        >
          Register
        </button>
      </form>
    </div>
  );
}
