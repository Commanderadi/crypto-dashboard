import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  market_cap_change_percentage_24h: number;
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof Coin>("market_cap");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    api.get<Coin[]>("/coins/list").then(res => setCoins(res.data));
  }, []);

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const pageCount = Math.ceil(filtered.length / perPage);

  const handleSort = (key: keyof Coin) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl mb-4 font-bold">Crypto Prices</h1>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search coin"
        className="bg-gray-800 p-2 mb-4 w-full rounded"
      />
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-gray-800">
          <thead>
            <tr>
              <th className="p-2 cursor-pointer" onClick={() => handleSort("name")}>Coin</th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort("current_price")}>Price</th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort("market_cap_change_percentage_24h")}>24h %</th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort("market_cap")}>Market Cap</th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort("total_volume")}>Volume</th>
              <th className="p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(coin => (
              <tr key={coin.id} className="hover:bg-gray-700 transition">
                <td className="flex items-center gap-2 p-2">
                  <img src={coin.image} alt={coin.symbol} className="w-6 h-6 rounded-full" />
                  <span className="font-semibold">{coin.name}</span>
                  <span className="uppercase text-gray-400">({coin.symbol})</span>
                </td>
                <td className="p-2">${coin.current_price.toLocaleString()}</td>
                <td className={`p-2 ${coin.market_cap_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}`}>
                  {coin.market_cap_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="p-2">${coin.market_cap.toLocaleString()}</td>
                <td className="p-2">${coin.total_volume.toLocaleString()}</td>
                <td className="p-2">
                  <button
                    className="bg-cyan-600 px-3 py-1 rounded text-white hover:bg-cyan-700"
                    onClick={() => navigate(`/coin/${coin.id}`)}
                  >View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >Prev</button>
        <span>Page {page} of {pageCount}</span>
        <button
          className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >Next</button>
      </div>
    </div>
  );
}
