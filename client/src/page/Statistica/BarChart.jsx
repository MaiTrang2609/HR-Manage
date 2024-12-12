import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Thống kê bảng lương 5 tháng gần đây",
    },
  },
};

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function BarChart({ payCheck }) {
  const [labels, setLabels] = useState([]);

  const handleSetLabel = () => {
    const value = payCheck?.map((item) => month[new Date(item.day).getMonth()]);
    setLabels(value);
  };

  useEffect(() => {
    handleSetLabel();
  }, [payCheck]);

  const data = {
    labels,
    datasets: [
      {
        label: "Lương Gross",
        data: payCheck?.map((item) => item.gross),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Bảo hiểm",
        data: payCheck?.map((item) => item.insurance),
        backgroundColor: "rgba(255, 206, 86, 0.2)",
      },
      {
        label: "Thuế",
        data: payCheck?.map((item) => item.tax),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },

      {
        label: "Lương Net",
        data: payCheck?.map((item) => item.net),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  return (
    <div className="flex-center">
      <Bar options={options} data={data} />;
    </div>
  );
}

export default BarChart;
