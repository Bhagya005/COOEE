import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import routing components
import { UserProvider } from "./context/UserContext";
import CheckNumber from "./components/checkArm";
import Login from "./components/login";
import Userdetails from "./components/userDetails";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route
            path="/check-armstrong"
            element={
              <PrivateRoute>
                <CheckNumber />
              </PrivateRoute> // Properly nested PrivateRoute wrapper
            }
          />
          <Route path="/user-details" element={<Userdetails />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
