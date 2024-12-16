import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserPage = () => {
  const { user_id } = useParams(); // Get the user_id from the URL
  const [userDetails, setUserDetails] = useState(null);
  const [numberDetails, setNumberDetails] = useState([]); // For table data

  useEffect(() => {
    if (user_id) {
      console.log(`Fetching details for user ID: ${user_id}`);

      // Fetch user details
      fetch(
        `http://localhost:8080/getuserdet?user_id=${encodeURIComponent(
          user_id
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
          console.log("User Details fetched:", data);
          setUserDetails(data);
        })
        .catch((error) => console.error("Error fetching user details:", error));

      // Fetch numbers entered by the user
      fetch(
        `http://localhost:8080/getusernumbers?user_id=${encodeURIComponent(
          user_id
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
          console.log("Number Details fetched:", data);
          setNumberDetails(data); // Store table data
        })
        .catch((error) =>
          console.error("Error fetching user number details:", error)
        );
    } else {
      console.warn("No user_id found in the URL");
    }
  }, [user_id]);

  if (!userDetails) {
    return (
      <div className="text-center text-lg mt-10">Loading user details...</div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-20 mt-20">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="text-custom-blue text-semi-bold flex items-center"
        >
          <span className="mr-2 text-semi-bold">&larr;</span> Back
        </button>

        {/* User Heading */}
        <h1 className="text-3xl font-bold text-custom-blue mx-auto">
          Searches by {userDetails.name}
        </h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto border-separate border  w-full ">
          <thead>
            <tr className="bg-custom-blue text-white">
              <th className="px-4 py-2 text-left text-xl rounded-tl-lg">NUMBER</th>
              <th className="px-4 py-2 text-xl text-left">RESULT</th>
              <th className="px-4 py-2 text-xl text-left">DATE</th>
              <th className="px-4 py-2 text-left text-xl rounded-tr-lg">TIME</th>
            </tr>
          </thead>
          <tbody>
            {numberDetails.map((entry, index) => (
              <tr key={entry.id} className="bg-custom-blue">
                <td className="border px-4 py-2 text-white">{entry.number}</td>
                <td className="border px-4 py-2 text-white">{entry.result}</td>
                <td className="border px-4 py-2 text-white">
                  {new Date(entry.created_at).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 text-white">
                  {new Date(entry.created_at).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPage;
