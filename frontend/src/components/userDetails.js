import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import UserBox from "./userBox";
import { useUser } from "../context/UserContext";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate(); // Initialize the navigate function
  const [otherUsers, setOtherUsers] = useState([]);

  useEffect(() => {
    console.log("Full user object:", user);

    if (user && user.user_id) {
      console.log(`Attempting to fetch user details for ID: ${user.user_id}`);

      fetch(
        `http://localhost:8080/getuserdet?user_id=${encodeURIComponent(
          user.user_id
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      )
        .then((response) => {
          console.log("Response status:", response.status);
          console.log(
            "Response headers:",
            Object.fromEntries(response.headers.entries())
          );

          // Check content type
          const contentType = response.headers.get("content-type");
          console.log("Content-Type:", contentType);

          if (!response.ok) {
            return response.text().then((text) => {
              console.error("Error response body:", text);
              throw new Error(
                `HTTP error! status: ${response.status}, body: ${text}`
              );
            });
          }

          if (!contentType || !contentType.includes("application/json")) {
            return response.text().then((text) => {
              console.error("Non-JSON response:", text);
              throw new Error("Received non-JSON response");
            });
          }

          return response.json();
        })
        .then((data) => {
          console.log("Data fetched from backend:", data);
          setUserDetails(data);
        })
        .catch((error) => {
          console.error("Detailed error fetching user details:", error);
        });
    } else {
      console.warn("User ID is not available. Cannot fetch details.", user);
    }
    if (user && user.user_id) {
      // Fetch remaining users
      fetch(
        `http://localhost:8080/getallusers?exclude_user_id=${encodeURIComponent(
          user.user_id
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Remaining users fetched:", data);
          setOtherUsers(data);
        })
        .catch((error) => {
          console.error("Error fetching remaining users:", error);
        });
    }
  }, [user]);

  const handleUserClick = (userID) => {
    // Navigate to the dynamic user details page with the user ID
    navigate(`/user-details/${userID}`);
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-custom-blue text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-semi-bold p-10 mb-8">
        Hey {user.name}, Let's meet our users
      </h1>

      <div className="flex items-center w-[90%] pb-8 pl-0 border-b-[0.1px] border-white/40">
        <span className="mr-8 pr-10 font-bold text-lg">You</span>
        <UserBox
          name={userDetails.name || user.name}
          searches={userDetails.searches}
          positives={userDetails.positives}
          negatives={userDetails.negatives}
          onClick={() => handleUserClick(user.user_id)} // Pass the user ID to handle the click
        />
      </div>

      <div className="flex flex-wrap justify-start w-full gap-6 pt-10 px-20">
        {otherUsers.map((userData) => (
          <UserBox
            key={userData.user_id}
            name={userData.name}
            searches={userData.searches}
            positives={userData.positives}
            negatives={userData.negatives}
            onClick={() => handleUserClick(userData.user_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserDetails;
