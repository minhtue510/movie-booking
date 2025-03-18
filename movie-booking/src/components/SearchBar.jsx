import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search your Movies..."
        value={searchTerm}
        onChange={handleChange}
        className="h-12 w-full bg-black text-white border-2 border-white rounded-full px-6 pr-12 text-sm placeholder-gray-300 outline-none"
      />
      
      <SearchOutlined 
        style={{ color: "#FF5524" }}
        className=" absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF5524] text-xl"
      />
    </div>
  );
};

export default SearchBar;
