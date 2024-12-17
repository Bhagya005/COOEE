import React, { useState } from "react";
import NavBar from "./navbar"; // Import the Navbar component

function ArmstrongChecker() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [armstrongNumbers, setArmstrongNumbers] = useState([]);

  // Function to check if a number is an Armstrong number
  const isArmstrong = (num) => {
    const digits = num.toString().split("");
    const power = digits.length;
    const sum = digits.reduce(
      (acc, digit) => acc + Math.pow(parseInt(digit), power),
      0
    );
    return sum === num;
  };

  // Function to calculate Armstrong numbers within the range
  const handleCheck = () => {
    const s = parseInt(start);
    const e = parseInt(end);
    if (!s || !e || s > e) {
      alert("Please enter a valid range!");
      return;
    }

    const results = [];
    for (let i = s; i <= e; i++) {
      if (isArmstrong(i)) results.push(i);
    }
    setArmstrongNumbers(results);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navbar */}
      
        <NavBar />
      

      {/* Main Content */}
      <div className="flex justify-center bg-custom-blue min-h-screen items-center">
        <div className="bg-white text-custom-blue rounded-lg shadow-md p-8 mb-20 w-[40%] h-[50%]">
          {/* Range Input Section */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <p className="font-bold text-2xl">Enter a range :</p>
            <input
              type="number"
              placeholder="Start"
              className="w-20 px-2 py-1 border border-custom-blue font-bold rounded-md text-center text-xl"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <span className="text-lg font-bold">-</span>
            <input
              type="number"
              placeholder="End"
              className="w-20 px-2 py-1 border border-custom-blue font-bold rounded-md text-center text-xl"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleCheck}
              className="px-4 py-2 bg-custom-blue text-white text-xl font-bold rounded-md hover:bg-opacity-90"
            >
              Check
            </button>
          </div>

          {/* Armstrong Numbers Display */}
          <div className="mt-6">
            <p className="text-xl font-semibold text-center mb-7">
              Armstrong numbers within the range
            </p>
            <div className="flex justify-center flex-wrap gap-4">
              {armstrongNumbers.length > 0 ? (
                armstrongNumbers.map((num, index) => (
                  <div
                    key={index}
                    className=" text-custom-blue  flex items-center justify-center rounded-md text-xl p-3 font-bold"
                  >
                    {num}
                  </div>
                ))
              ) : (
                <p className="text-custom-blue text-xl">No numbers found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArmstrongChecker;
