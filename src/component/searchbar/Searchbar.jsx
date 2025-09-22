import React from "react";

const Searchbar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="w-full max-w-sm mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />
    </div>
  );
};

export default Searchbar;
