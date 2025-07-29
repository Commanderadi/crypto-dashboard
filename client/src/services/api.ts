import axios from "axios";
export const api = axios.create({ baseURL: "https://intelicrypto.onrender.com/api" });

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const watchlistApi = {
  async get() {
    const res = await api.get("/user/watchlist", { headers: getAuthHeaders() });
    return res.data.watchlist;
  },
  async add(coinId: string) {
    const res = await api.post("/user/watchlist", { coinId }, { headers: getAuthHeaders() });
    return res.data.watchlist;
  },
  async remove(coinId: string) {
    const res = await api.delete("/user/watchlist", { data: { coinId }, headers: getAuthHeaders() });
    return res.data.watchlist;
  },
};

export const portfolioApi = {
  async get() {
    const res = await api.get("/user/portfolio", { headers: getAuthHeaders() });
    return res.data.portfolio;
  },
  async addOrUpdate(coinId: string, amount: number) {
    const res = await api.post("/user/portfolio", { coinId, amount }, { headers: getAuthHeaders() });
    return res.data.portfolio;
  },
  async remove(coinId: string) {
    const res = await api.delete("/user/portfolio", { data: { coinId }, headers: getAuthHeaders() });
    return res.data.portfolio;
  },
};