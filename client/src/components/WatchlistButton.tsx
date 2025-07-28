import React, { useEffect, useState } from "react";
import { watchlistApi } from "../services/api";

export function WatchlistButton({ coinId }: { coinId: string }) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    watchlistApi.get().then(list => {
      if (mounted) setInWatchlist(list.includes(coinId));
    });
    return () => { mounted = false; };
  }, [coinId]);

  const handleClick = async () => {
    setLoading(true);
    if (inWatchlist) {
      await watchlistApi.remove(coinId);
      setInWatchlist(false);
    } else {
      await watchlistApi.add(coinId);
      setInWatchlist(true);
    }
    setLoading(false);
  };

  return (
    <button
      className={`px-3 py-1 rounded ${inWatchlist ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"} hover:opacity-80`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "..." : inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
} 