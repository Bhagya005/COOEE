import React, { useState } from "react";

const LoginForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

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
      // Send name and email to the backend
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User successfully logged in!");
        console.log("Response:", data);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-blue">
      <div className="md:w-2/6 md:h-2/3 bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-4 text-center text-custom-blue">
            Welcome
          </h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-bold text-custom-blue">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold text-custom-blue">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-transparent"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-custom-blue text-white font-bold py-2 px-4 rounded shadow hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-500"
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
