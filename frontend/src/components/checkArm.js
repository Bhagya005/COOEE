import React, { useState } from "react";
import thumbsUp from "../static/thumbsUp.gif";
import thumbsDown from "../static/thumbsDown.gif";
const CheckNumber = () => {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");

  const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, digits.length), 0);
    return sum === num;
  };

  const handleCheck = () => {
    // Check if the entered value contains anything other than digits
    if (!/^\d+$/.test(number)) {
      alert("Please enter a valid numeric value");
      return;
    }

    const num = parseInt(number, 10);

    if (isArmstrong(num)) {
      setResult({ message: "Congrats! You have discovered an Armstrong Number", gif: thumbsUp });
    } else {
      setResult({ message: "Not Armstrong. Try another!", gif: thumbsDown });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] bg-gray-100">
      <div className="bg-custom-blue text-white p-8 rounded-lg shadow-md w-2/7 h-[45%] flex flex-col items-center justify-center">
        <div className="flex flex-col justify-between h-full w-full">
          <button
            className="text-white mb-4 focus:outline-none self-start"
            onClick={() => alert("Back clicked!")}
          >
            ←
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Let's Check a number
            </h1>
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
          <span className="text-lg text-center font-bold text-custom-blue">{result.message}</span>
        </div>
      )}
    </div>
  );
};

export default CheckNumber;
