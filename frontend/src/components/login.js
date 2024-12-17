import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext"; // Access the user context
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginForm = () => {
  const { setUserDetails, user } = useUser(); // Access the user context and setUserDetails function
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Clear the user context when the login page loads
    console.log("Resetting UserContext");
    setUserDetails({ user_id: null, name: "", email: "" });
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
  }, []); // Runs only when the component mounts

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Name entered:", name);
    console.log("Email entered:", email);

    // Input validation
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (response.ok) {
        // Update UserContext and localStorage with the new user_id
        setUserDetails({
          user_id: data.user_id, // Use the unique `user_id`
          name: data.name,
          email: data.email,
        });

        console.log("UserContext updated:", {
          user_id: data.user_id,
          name: data.name,
          email: data.email,
        });

        // Persist user details in localStorage
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);

        alert("User successfully logged in!");
        navigate("/home"); // Navigate to the Armstrong check page
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-blue">
      <div className="md:w-2/6 md:h-2/3 bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleLogin}>
          <h2 className="text-4xl font-bold mb-4 text-center text-custom-blue">Welcome</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-xl font-bold text-custom-blue">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Updates `name` state
              className="mt-1 block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-xl font-bold text-custom-blue">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Updates `email` state
              className="mt-1 block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-custom-blue text-xl text-white font-bold py-2 px-4 rounded shadow hover:bg-opacity-90 focus:outline-none focus:ring focus:ring-blue-500"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
