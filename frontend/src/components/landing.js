import React from 'react';
import NavBar from './navbar'; // Import the NavBar component
import mascot from "../static/mascot.png"; // Import mascot image
import numbers from "../static/numbers.png";
const LandingPage = () => {
  return (
    <div className="text-white flex flex-col h-screen ">
      {/* Include the NavBar component at the top */}
      <NavBar />

      {/* Main content below the navbar */}
      <div className="flex flex-col h-[100%]"> {/* Added pt-20 to create space for the navbar */}
        
        {/* Top part with the numbers image and text */}
        <div className="bg-custom-blue flex items-center justify-center p-10 pb-3 space-x-10">
          <div className="flex w-[30%] flex-col items-center pl-10">
            <img src={numbers} alt="Numbers" className="w-52 h-50" />
          </div>
          <div className="text-center w-[30%]">
            <h2 className="text-5xl font-semibold mb-4">Number Quest</h2>
          </div>
        </div>

        {/* Bottom part with mascot image and text */}
        <div className="flex items-center justify-center p-10 ">
          <div className="text-center w-[30%]">
            <p className="text-2xl mx-auto text-custom-blue font-bold pr-10">
              Check if your number is an Armstrong number! Sign up, enter a number, and get the result instantly. Simple, fast, and fun!
            </p>
          </div>
          <div className="flex flex-col w-[20%] items-center">
            <img src={mascot} alt="Mascot" className="w-54 h-52" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
