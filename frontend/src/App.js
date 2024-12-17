import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import routing components
import { UserProvider } from "./context/UserContext";
import CheckNumber from "./components/checkArm";
import Login from "./components/login";
import UserPage from "./components/userPage";
import Userdetails from "./components/userDetails";
import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./components/landing";
import ArmstrongChecker from "./components/rangeArm";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public route for login */}
          <Route path="/" element={<Login />} /> 

          {/* Private routes for all other components */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <LandingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/check-armstrong"
            element={
              <PrivateRoute>
                <CheckNumber />
              </PrivateRoute>
            }
          />
          <Route
            path="/armrange"
            element={
              <PrivateRoute>
                <ArmstrongChecker />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-details"
            element={
              <PrivateRoute>
                <Userdetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-details/:user_id"
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
