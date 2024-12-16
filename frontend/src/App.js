import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import routing components
import { UserProvider } from "./context/UserContext";
import CheckNumber from "./components/checkArm";
import Login from "./components/login";
import UserPage from "./components/userPage";
import Userdetails from "./components/userDetails";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./components/landing";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Default route */}
          <Route path="/check-armstrong" element={<CheckNumber />} /> {/* Default route */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <LandingPage />
              </PrivateRoute> // Properly nested PrivateRoute wrapper
            }
          />
          <Route path="/user-details" element={<Userdetails />} />
          <Route path="/user-details/:user_id" element={<UserPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
