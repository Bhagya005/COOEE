import React from "react";
import { UserProvider } from "./context/UserContext"; // import UserProvider
 import CheckNumber from "./components/checkArm"; // Example component
import Login from "./components/login"; // Example login component

const App = () => {
  return (
    <UserProvider>
      <div>
        {/* <Login /> */}
        <CheckNumber />
      </div>
    </UserProvider>
  );
};

export default App;
