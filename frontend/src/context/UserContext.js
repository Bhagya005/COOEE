import React, { createContext, useState, useContext, useEffect } from "react";

// Create UserContext
const UserContext = createContext();

// UserProvider component to wrap around your app
export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    // Fetch from localStorage to initialize state
    const storedUser = localStorage.getItem("user_id");
    return storedUser
      ? {
          user_id: storedUser,
          name: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
        }
      : { user_id: null, name: "", email: "" };
  });

  // Function to update user context
  const setUserDetails = (userDetails) => {
    setUser(userDetails);
    // Store user details in localStorage for persistence
    localStorage.setItem("user_id", userDetails.user_id);
    localStorage.setItem("name", userDetails.name);
    localStorage.setItem("email", userDetails.email);
  };

  // Reset the UserContext when the Login page is loaded (for example, on logout or before login)
  useEffect(() => {
    // If the user visits the login page, reset UserContext and localStorage
    const resetUserContext = () => {
      setUser({ user_id: null, name: "", email: "" });
      localStorage.removeItem("user_id");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
    };

    // If the user explicitly navigates to the login page, reset the context
    if (window.location.pathname === "/") {
      resetUserContext();
    }
  }, []); // Only run once when the component mounts

  return (
    <UserContext.Provider value={{ user, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
