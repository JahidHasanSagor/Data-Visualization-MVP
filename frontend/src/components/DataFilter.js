import React, { useState } from "react";

const DataFilter = ({ data, setFilteredData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilter = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(term)
      )
    );

    setFilteredData(filtered);
  };

  return (
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={handleFilter}
      className="block w-full px-3 py-2 mt-2 border rounded-md"
    />
  );
};

export default DataFilter;
