import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Chart } from "../components/Chart";
import { WatchlistButton } from "../components/WatchlistButton";

interface CoinDetailType {
  id: string;
  name: string;
  symbol: string;
  image: { small: string; large: string };
  links: { homepage: string[]; twitter_screen_name?: string; subreddit_url?: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    circulating_supply: number;
    total_supply: number;
    price_change_percentage_24h: number;
  };
  description: { en: string };
}

const timeRanges = [
  { label: "1D", value: 1 },
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "1Y", value: 365 },
  { label: "All", value: "max" },
];

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<CoinDetailType | null>(null);
  const [hist, setHist] = useState<[number, number][]>([]);
  const [days, setDays] = useState<number | string>(30);
  const [news, setNews] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<{ label: string; score: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api.get(`/coins/${id}`).then(r => setDetail(r.data));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    api.get(`/coins/${id}/history?days=${days}`).then(r => setHist(r.data.prices));
  }, [id, days]);

  useEffect(() => {
    if (!id) return;
    api.get(`/coin/${id}/news`).then(r => setNews(r.data.articles || []));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    api.get(`/coin/${id}/sentiment`).then(r => setSentiment(r.data));
  }, [id]);

  if (!detail) return <div>Loading...</div>;

  // Show spinner while historical data is loading
  if (detail && hist.length === 0) {
    return (
      <div className="p-4 bg-gray-900 min-h-screen text-white">
        <button onClick={() => navigate("/")} className="underline mb-2">← Back</button>
        <div className="flex items-center gap-4 mb-2">
          <img src={detail.image?.small} alt={detail.symbol} className="w-10 h-10" />
          <h1 className="text-2xl font-bold">{detail.name} ({detail.symbol.toUpperCase()})</h1>
        </div>
        <p>Current Price: ${detail.market_data.current_price.usd}</p>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <button onClick={() => navigate("/")} className="underline mb-2">← Back</button>
      <div className="flex items-center gap-4 mb-2">
        <img src={detail.image?.large} alt={detail.symbol} className="w-14 h-14" />
        <h1 className="text-3xl font-bold">{detail.name} <span className="uppercase text-gray-400">({detail.symbol})</span></h1>
        <WatchlistButton coinId={detail.id} />
      </div>
      <div className="flex flex-wrap gap-6 mb-4">
        <div>
          <div className="text-lg font-semibold">${detail.market_data.current_price.usd.toLocaleString()}</div>
          <div className={`text-sm ${detail.market_data.price_change_percentage_24h > 0 ? "text-green-400" : "text-red-400"}`}>
            {detail.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Market Cap</div>
          <div>${detail.market_data.market_cap.usd.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Volume (24h)</div>
          <div>${detail.market_data.total_volume.usd.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Circulating Supply</div>
          <div>{detail.market_data.circulating_supply?.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Total Supply</div>
          <div>{detail.market_data.total_supply?.toLocaleString() || "-"}</div>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {timeRanges.map(tr => (
          <button
            key={tr.label}
            className={`px-3 py-1 rounded ${days === tr.value ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-200"}`}
            onClick={() => setDays(tr.value)}
          >{tr.label}</button>
        ))}
      </div>
      {hist?.length > 0 && <Chart data={hist} />}
      <div className="mt-6 prose prose-invert max-w-none">
        <h2>About {detail.name}</h2>
        <div dangerouslySetInnerHTML={{ __html: detail.description.en?.split('. ')[0] + '.' }} />
      </div>
      {/* Social Sentiment Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Social Sentiment</h2>
        {sentiment ? (
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded text-lg font-semibold ${sentiment.label === 'positive' ? 'bg-green-600' : sentiment.label === 'negative' ? 'bg-red-600' : 'bg-gray-700'}`}>{sentiment.label.toUpperCase()}</span>
            <span className="text-gray-400">Score: {sentiment.score.toFixed(2)}</span>
          </div>
        ) : (
          <div className="text-gray-400">Loading sentiment...</div>
        )}
      </div>
      {/* News Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Latest News</h2>
        {news.length === 0 ? (
          <div className="text-gray-400">No news found.</div>
        ) : (
          <ul className="space-y-3">
            {news.map((article, i) => (
              <li key={i} className="bg-gray-800 rounded p-3">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-semibold hover:underline">
                  {article.title}
                </a>
                <div className="text-xs text-gray-400 mt-1">
                  {article.source?.name} &middot; {new Date(article.publishedAt).toLocaleString()}
                </div>
                {article.description && <div className="text-sm mt-1">{article.description}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 items-center">
        {detail.links.homepage[0] && (
          <a href={detail.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="underline text-cyan-400">Official Site</a>
        )}
        {detail.links.twitter_screen_name && (
          <a href={`https://twitter.com/${detail.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">Twitter</a>
        )}
        {detail.links.subreddit_url && (
          <a href={detail.links.subreddit_url} target="_blank" rel="noopener noreferrer" className="underline text-orange-400">Reddit</a>
        )}
      </div>
    </div>
  );
}
