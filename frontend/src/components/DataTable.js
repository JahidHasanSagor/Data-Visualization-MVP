import React from "react";

const DataTable = ({ data }) => {
  if (!data || data.length === 0) return <p>No data to display.</p>;

  // Extract column headers dynamically
  const columns = Object.keys(data[0]);

  return (
    <div>
      <h3>Uploaded Data</h3>
      <table border="1">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
