import axios from "axios";
const BASE = "https://api.coingecko.com/api/v3";

export async function fetchMarketChart(id, days = 30) {
  const res = await axios.get(`${BASE}/coins/${id}/market_chart`, {
    params: { vs_currency: "usd", days }
  });
  return res.data;
}
