import React from "react";
import { Line } from "react-chartjs-2";

// ✅ Import and register components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register them with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: [number, number][];
}

export function Chart({ data }: ChartProps) {
  return (
    <Line
      data={{
        labels: data.map(d => new Date(d[0]).toLocaleDateString()),
        datasets: [{
          label: "Price USD",
          data: data.map(d => d[1]),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3, // optional for smooth curves
        }]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          title: {
            display: true,
            text: "Price Over Time",
          },
        },
      }}
    />
  );
}
