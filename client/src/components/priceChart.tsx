// components/priceChart.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

interface Props {
  coin: string;
}

const PriceChart: React.FC<Props> = ({ coin }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=7`
        );

        const prices = res.data.prices;
        const labels = prices.map((p: any) =>
          new Date(p[0]).toLocaleDateString()
        );
        const data = prices.map((p: any) => p[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: `7-Day Price of ${coin}`,
              data,
              fill: true,
              borderColor: "#00c6ff",
              backgroundColor: "rgba(0, 198, 255, 0.2)",
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to load chart data", err);
      }
    };

    fetchChartData();
  }, [coin]);

  return (
    <div style={{ marginTop: 40 }}>
      <h3>📊 Historical Price Chart</h3>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default PriceChart;
