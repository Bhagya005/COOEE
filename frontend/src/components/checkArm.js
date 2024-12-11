import React, { useState } from "react";
import { useUser } from "../context/UserContext"; // Access the user context
import { useNavigate } from "react-router-dom"; // Import useNavigate
import thumbsUp from "../static/thumbsUp.gif";
import thumbsDown from "../static/thumbsDown.gif";

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
    <div className="flex flex-col items-center justify-center h-[100vh] bg-gray-100">
      <div className="bg-custom-blue text-white p-8 rounded-lg shadow-md w-2/7 h-[45%] flex flex-col items-center justify-center">
        <div className="flex flex-col justify-between h-full w-full">
          <button
            className="text-white mb-4 focus:outline-none self-start"
            onClick={handleNavigate} // Call handleNavigate on click
          >
            ←
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">Let's Check a number</h1>
            <label htmlFor="number" className="block text-sm mb-2 text-center">
              Enter a number
            </label>
            <input
              id="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full p-2 rounded bg-white text-custom-blue border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCheck}
            className="mt-4 bg-white font-bold text-custom-blue px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition self-center"
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
  );
};

export default CheckNumber;
