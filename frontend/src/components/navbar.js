// components/NavBar.js
import React from 'react';

const NavBar = () => {
  return (
    
      <div className="flex justify-end space-x-10 p-5 pr-10 pb-7 bg-custom-blue text-3xl"
    >
        <a href="/home" className="text-lg text-white font-semibold hover:border-b-2 hover:border-white ">HOME</a>
        <a href="/check-armstrong" className="text-lg text-white font-semibold hover:border-b-2 hover:border-white">CHECK</a>
        <a href="/" className="text-lg font-semibold text-white hover:border-b-2 hover:border-white pb-1">LIST</a>
        <a href="/user-details" className="text-lg text-white font-semibold hover:border-b-2 hover:border-white">USERS</a>
        <a href="/" className="text-lg font-semibold text-white hover:border-b-2 hover:border-white">LOGOUT</a>
      </div>
  );
};

export default NavBar;
