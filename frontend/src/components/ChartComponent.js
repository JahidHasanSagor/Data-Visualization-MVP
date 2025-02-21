import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register necessary chart elements
ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const ChartComponent = ({ data, chartType, color }) => {
  // ✅ Ensure `data` is valid before processing
  if (!data || data.length === 0) return <p className="text-gray-400 text-center">No data to display.</p>;

  const keys = Object.keys(data[0] || {});
  if (keys.length < 2) return <p className="text-gray-400 text-center">Invalid data format.</p>;

  const labels = data.map((item) => item[keys[0]] || "Unknown");
  const values = data.map((item) => parseFloat(item[keys[1]]) || 0);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: keys[1] || "Data",
        data: values,
        backgroundColor: color || "rgba(75,192,192,0.6)",
        borderColor: color || "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-container">
      {chartType === "bar" && <Bar data={chartData} />}
      {chartType === "line" && <Line data={chartData} />}
      {chartType === "pie" && <Pie data={chartData} />}
    </div>
  );
};

export default ChartComponent;
