import React, { useState } from "react";
import { useUser } from "../context/UserContext"; // Access user data from the context
import { useNavigate } from "react-router-dom"; // Import useNavigate
import thumbsUp from "../static/thumbsUp.gif";
import thumbsDown from "../static/thumbsDown.gif";
import NavBar from "./navbar"; // Import NavBar component

const CheckNumber = () => {
  const { user } = useUser(); // Access user data from the context
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleCheck = async () => {
    if (!/^\d+$/.test(number)) {
      alert("Please enter a valid numeric value");
      return;
    }

    const num = parseInt(number, 10);

    // Check if the number is Armstrong
    const isArmstrongNumber = isArmstrong(num);
    const resultText = isArmstrongNumber ? "positive" : "negative";

    try {
      // Send the number, user id, and result to the backend
      const response = await fetch("http://localhost:8080/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id, // Pass the UID from context
          number: num,
          result: resultText, // Send the result as positive or negative
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Backend Response:", data);
        // Set result based on the backend response
        setResult({
          message: isArmstrongNumber
            ? `Congrats! Number ${num} is an Armstrong number.`
            : `Number ${num} is not an Armstrong number.`,
          gif: isArmstrongNumber ? thumbsUp : thumbsDown,
        });
      } else {
        const error = await response.json();
        alert(error.error || "An error occurred");
        setResult({
          message: `An error occurred while checking the number.`,
          gif: thumbsDown,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, digits.length), 0);
    return sum === num;
  };

  const handleNavigate = () => {
    navigate("/user-details"); // Navigate to the /user-details page
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col"> {/* Ensured full height with min-h-screen */}
      <NavBar /> {/* Fixed NavBar at the top */}

      <div className="flex flex-col items-center justify-start flex-1 pt-28"> {/* pt-28 to ensure spacing for NavBar */}
        <div className="bg-custom-blue text-white p-8 px-0 rounded-lg shadow-md w-[30%] pb-15 h-[40%] flex flex-col items-center justify-center">
          {/* Increased height and added flex-grow to parent container */}
          <div className="flex flex-col justify-between h-full w-full p-8 px-0">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold mb-4 text-center pb-2">Let's Check a number</h1>
              <label htmlFor="number" className="block text-2xl mb-2 text-centerpb-5">
                Enter a number
              </label>
              <input
                id="number"
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-[70%] p-2 rounded bg-white text-custom-blue text-center text-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCheck}
              className="mt-4 bg-white text-xl font-bold text-custom-blue px-4 py-2 rounded hover:text-bold transition self-center"
            >
              Check
            </button>
          </div>
        </div>

        {result && (
          <div className="flex items-center pt-5 w-[20%] justify-center space-x-0">
            <img src={result.gif} alt="Result" className="w-[120px] h-[100px]" />
            <span className="text-sm text-center font-bold text-custom-blue">{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckNumber;
