import React, { useEffect, useState } from "react";
import UserBox from "./userBox";
import { useUser } from "../context/UserContext";

const UserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { user } = useUser(); // Access `user` from the context

  // Debugging: Print the current user from context
  console.log("User from context:", user);

  useEffect(() => {
    // Ensure `user.id` is valid before making a fetch request
    if (user.user_id) {
      console.log(`Fetching user details for ID: ${user.user_id}`);
  
      fetch(`/getuserdet?user_id=${user.user_id}`)
        .then((response) => {
          console.log("Response status:", response.status); // Log response status
          return response.text(); // Get response as text for debugging
        })
        .then((data) => {
          try {
            const jsonData = JSON.parse(data); // Attempt to parse it as JSON
            console.log("Data fetched from backend:", jsonData);
            setUserDetails(jsonData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    } else {
      console.warn("User ID is not available. Cannot fetch details.");
    }
  }, [user.user_id]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-custom-blue text-white flex flex-col items-center py-10">
      <h1 className="text-2xl font-semi-bold p-10 mb-8">Hey Bhagya, Let's meet our users</h1>

      {/* First Row: 'You' text and single UserBox */}
      <div className="flex items-center w-[90%] pb-8 pl-0 border-b-[0.1px] border-white/40">
        <span className="mr-8 pr-10 font-bold text-lg">You</span>
        <UserBox
          name={userDetails.name}
          searches={userDetails.searches}
          positives={userDetails.positives}
          negatives={userDetails.negatives}
        />
      </div>

      {/* Remaining Rows: Dynamically rendered User Boxes */}
      <div className="flex flex-wrap justify-start w-full gap-6 pt-10 px-20">
        {/* Additional user boxes can be rendered here if needed */}
      </div>
    </div>
  );
};

export default UserDetails;
