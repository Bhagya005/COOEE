import React from "react";

const UserBox = ({ name, searches, positives, negatives, onClick }) => {
  return (
    <div
      className="bg-white p-4 rounded-md shadow-md w-60 h-37 flex flex-col justify-between cursor-pointer"
      onClick={onClick} // Add onClick handler
    >
      <h2 className="text-xxlg font-bold text-custom-blue">{name}</h2>
      <div className="text-gray-600">
        <p>Searches: <span className="font-semibold text-lg text-custom-blue">{searches}</span></p>
        <p>Positives: <span className="font-semibold text-lg text-custom-blue">{positives}</span></p>
        <p>Negatives: <span className="font-semibold text-lg text-custom-blue">{negatives}</span></p>
      </div>
    </div>
  );
};

export default UserBox;
