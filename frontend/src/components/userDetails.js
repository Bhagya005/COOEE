import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import UserBox from "./userBox";
import { useUser } from "../context/UserContext";
import NavBar from "./navbar";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]); // Initialize as an empty array
  const { user } = useUser();
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    if (user && user.user_id) {
      console.log(`Attempting to fetch user details for ID: ${user.user_id}`);

      fetch(`http://localhost:8080/getuserdet?user_id=${encodeURIComponent(user.user_id)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User Details fetched:", data);
          setUserDetails(data);
        })
        .catch((error) => console.error("Error fetching user details:", error));

      // Fetch remaining users
      fetch(`http://localhost:8080/getremainingusers?user_id=${encodeURIComponent(user.user_id)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Other Users fetched:", data);
          setOtherUsers(data); // Store the list of other users
        })
        .catch((error) => console.error("Error fetching other users:", error));
    } else {
      console.warn("User ID is not available. Cannot fetch details.", user);
    }
  }, [user]);

  // Ensure that `otherUsers` is an array before attempting to use `.map()`
  if (!Array.isArray(otherUsers)) {
    console.error("otherUsers is not an array", otherUsers);
    return <div>Loading...</div>;
  }

  const handleUserClick = (userID) => {
    // Navigate to the dynamic user details page with the user ID
    navigate(`/user-details/${userID}`);
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" min-h-screen text-white flex flex-col">
      {/* Navbar at the top */}
      <NavBar />

      {/* Main content container */}
      <div className="flex flex-col bg-custom-blue items-center justify-start flex-grow pt-20 px-10">
        <h1 className="text-4xl font-semi-bold mb-8">Hey {user.name}, Let's meet our users</h1>

        {/* Current user details */}
        <div className="flex items-center w-full pt-10 pb-8 border-b-[0.1px] border-white/40">
          <span className="mr-8 pr-10 font-bold text-xl">You</span>
          <UserBox
            name={userDetails.name || user.name}
            searches={userDetails.searches}
            positives={userDetails.positives}
            negatives={userDetails.negatives}
            onClick={() => handleUserClick(user.user_id)} // Pass the user ID to handle the click
          />
        </div>

        {/* Other users */}
        <div className="flex flex-wrap justify-start w-full gap-6 pt-10">
          {otherUsers.length > 0 ? (
            otherUsers.map((otherUser) => (
              <UserBox
                key={otherUser.user_id}
                name={otherUser.name}
                searches={otherUser.searches}
                positives={otherUser.positives}
                negatives={otherUser.negatives}
                onClick={() => handleUserClick(otherUser.user_id)}
              />
            ))
          ) : (
            <p>No other users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
