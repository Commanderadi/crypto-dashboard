import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { WatchlistButton } from "../components/WatchlistButton";
import { portfolioApi } from "../services/api";

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

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Coin>("market_cap");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 20;
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<{ coinId: string; amount: number }[]>([]);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [newCoin, setNewCoin] = useState("");
  const [newAmount, setNewAmount] = useState(0);

  useEffect(() => {
    api.get<Coin[]>("/coins/list").then(r => setCoins(r.data));
    // Fetch watchlist
    (async () => {
      try {
        const wl = await import("../services/api").then(m => m.watchlistApi.get());
        setWatchlist(wl);
      } catch {}
    })();
    // Fetch portfolio
    (async () => {
      try {
        const pf = await import("../services/api").then(m => m.portfolioApi.get());
        setPortfolio(pf);
      } catch {}
    })();
  }, []);

  const filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1;
    return 0;
  });

  const paginated = sorted.slice((page - 1) * perPage, page * perPage);
  const pageCount = Math.ceil(filtered.length / perPage);

  // Trending: top 5 by market cap
  const trending = sorted.slice(0, 5);
  // Top Gainers: top 5 by 24h % change
  const gainers = [...coins].sort((a, b) => b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h).slice(0, 5);
  // Top Losers: bottom 5 by 24h % change
  const losers = [...coins].sort((a, b) => a.market_cap_change_percentage_24h - b.market_cap_change_percentage_24h).slice(0, 5);

  const handleSort = (key: keyof Coin) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  // My Watchlist section
  const watchlistCoins = coins.filter(c => watchlist.includes(c.id));

  // My Portfolio section
  const portfolioCoins = portfolio.map(h => {
    const coin = coins.find(c => c.id === h.coinId);
    return coin ? { ...coin, amount: h.amount } : null;
  }).filter(Boolean) as (Coin & { amount: number })[];
  const totalValue = portfolioCoins.reduce((sum, c) => sum + c.current_price * c.amount, 0);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl mb-4 font-bold">Crypto Dashboard</h1>
      {/* Trending Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Trending</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {trending.map(coin => (
            <div key={coin.id} className="flex flex-col items-center bg-gray-800 rounded-lg p-3 min-w-[120px] shadow">
              <img src={coin.image} alt={coin.symbol} className="w-8 h-8 mb-1" />
              <span className="font-semibold text-sm">{coin.name}</span>
              <span className="uppercase text-xs text-gray-400">{coin.symbol}</span>
              <span className="text-xs mt-1">${coin.current_price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Top Gainers & Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-green-400">Top Gainers (24h)</h2>
          <ul>
            {gainers.map(coin => (
              <li key={coin.id} className="flex items-center gap-2 mb-2">
                <img src={coin.image} alt={coin.symbol} className="w-5 h-5" />
                <span className="font-semibold text-sm">{coin.name}</span>
                <span className="uppercase text-xs text-gray-400">({coin.symbol})</span>
                <span className="ml-auto text-green-400">{coin.market_cap_change_percentage_24h.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-red-400">Top Losers (24h)</h2>
          <ul>
            {losers.map(coin => (
              <li key={coin.id} className="flex items-center gap-2 mb-2">
                <img src={coin.image} alt={coin.symbol} className="w-5 h-5" />
                <span className="font-semibold text-sm">{coin.name}</span>
                <span className="uppercase text-xs text-gray-400">({coin.symbol})</span>
                <span className="ml-auto text-red-400">{coin.market_cap_change_percentage_24h.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* My Watchlist Section */}
      {watchlistCoins.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">My Watchlist</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {watchlistCoins.map(coin => (
              <div key={coin.id} className="flex flex-col items-center bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3 min-w-[120px] shadow">
                <img src={coin.image} alt={coin.symbol} className="w-8 h-8 mb-1" />
                <span className="font-semibold text-sm">{coin.name}</span>
                <span className="uppercase text-xs text-gray-400">{coin.symbol}</span>
                <span className="text-xs mt-1">${coin.current_price.toLocaleString()}</span>
                <WatchlistButton coinId={coin.id} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* My Portfolio Section */}
      <div className="mb-6">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded mb-2"
          onClick={() => setShowPortfolio(v => !v)}
        >
          {showPortfolio ? "Hide" : "Show"} My Portfolio
        </button>
        {showPortfolio && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">My Portfolio</h2>
            <form
              className="flex flex-wrap gap-2 mb-4"
              onSubmit={async e => {
                e.preventDefault();
                if (!newCoin || newAmount <= 0) return;
                const pf = await portfolioApi.addOrUpdate(newCoin, newAmount);
                setPortfolio(pf);
                setNewCoin("");
                setNewAmount(0);
              }}
            >
              <select
                className="bg-gray-700 text-white p-2 rounded"
                value={newCoin}
                onChange={e => setNewCoin(e.target.value)}
              >
                <option value="">Select coin</option>
                {coins.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
                ))}
              </select>
              <input
                type="number"
                className="bg-gray-700 text-white p-2 rounded"
                placeholder="Amount"
                value={newAmount || ""}
                onChange={e => setNewAmount(Number(e.target.value))}
                min={0}
                step={0.0001}
              />
              <button className="bg-green-600 px-3 py-1 rounded text-white" type="submit">Add/Update</button>
            </form>
            {portfolioCoins.length > 0 ? (
              <table className="min-w-full bg-gray-900 rounded mb-2">
                <thead>
                  <tr>
                    <th className="p-2">Coin</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Value</th>
                    <th className="p-2">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioCoins.map(c => (
                    <tr key={c.id}>
                      <td className="flex items-center gap-2 p-2">
                        <img src={c.image} alt={c.symbol} className="w-6 h-6 rounded-full" />
                        <span>{c.name}</span>
                        <span className="uppercase text-gray-400">({c.symbol})</span>
                      </td>
                      <td className="p-2">{c.amount}</td>
                      <td className="p-2">${c.current_price.toLocaleString()}</td>
                      <td className="p-2">${(c.current_price * c.amount).toLocaleString()}</td>
                      <td className="p-2">
                        <button
                          className="bg-red-600 px-2 py-1 rounded text-white"
                          onClick={async () => {
                            const pf = await portfolioApi.remove(c.id);
                            setPortfolio(pf);
                          }}
                        >Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-400">No holdings yet.</div>
            )}
            <div className="text-lg font-bold mt-2">Total Value: ${totalValue.toLocaleString()}</div>
          </div>
        )}
      </div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
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
                  <WatchlistButton coinId={coin.id} />
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
