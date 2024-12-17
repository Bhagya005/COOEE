import React, { createContext, useState, useContext, useEffect } from "react";

// Create UserContext
const UserContext = createContext();

// UserProvider component to wrap around your app
export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
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
    localStorage.setItem("user_id", userDetails.user_id);
    localStorage.setItem("name", userDetails.name);
    localStorage.setItem("email", userDetails.email);
  };

  // Reset the UserContext when the pathname changes to "/"
  useEffect(() => {
    const resetUserContext = () => {
      setUser({ user_id: null, name: "", email: "" });
      localStorage.removeItem("user_id");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
    };

    // Check if the current path is the login page
    if (window.location.pathname === "/") {
      resetUserContext();
    }
  }, [window.location.pathname]); // Run whenever the pathname changes

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
