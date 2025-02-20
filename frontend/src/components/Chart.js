import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const ChartComponent = ({ data }) => {
  if (!data || data.length === 0) return <p>No data to display in chart.</p>;

  // Dynamically get the column names
  const keys = Object.keys(data[0]);
  const labels = data.map((item) => item[keys[0]]);
  const values = data.map((item) => parseFloat(item[keys[1]]));

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: keys[1],
        data: values,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>Bar Chart</h3>
      <Bar data={chartData} />

      <h3>Line Chart</h3>
      <Line data={chartData} />

      <h3>Pie Chart</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default ChartComponent;
