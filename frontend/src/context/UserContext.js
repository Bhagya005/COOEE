import React, { createContext, useState, useContext } from "react";

// Create UserContext
const UserContext = createContext();

// UserProvider component to wrap around your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
  });

  // Function to update user context
  const setUserDetails = (userDetails) => {
    setUser(userDetails);
  };

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
