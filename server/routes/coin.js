import express from "express";
import axios from "axios";
import { fetchMarketChart } from "../utils/coingecko.js";
import dotenv from 'dotenv';
import Sentiment from 'sentiment';
dotenv.config();
const NEWS_API_KEY = process.env.NEWS_API_KEY || '9116a17a5c934a03a7fcbca0d4fdd7d4';

const router = express.Router();
const BASE = "https://api.coingecko.com/api/v3"; // ✅ Add this line

// Get list of coins
router.get("/list", async (_, res) => {
  try {
    const { data } = await axios.get(`${BASE}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 50,
        page: 1,
      },
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching coin list:", err.message);
    res.status(500).json({ error: "Failed to fetch coin list" });
  }
});

// Get coin details
router.get("/:id", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE}/coins/${req.params.id}`, {
      params: { localization: false, market_data: true },
    });
    res.json(data);
  } catch (err) {
    console.error("Error fetching coin details:", err.message);
    res.status(500).json({ error: "Failed to fetch coin details" });
  }
});

// Get coin historical data
router.get("/:id/history", async (req, res) => {
  try {
    const chart = await fetchMarketChart(req.params.id, req.query.days || 30);
    res.json(chart);
  } catch (err) {
    console.error("Error fetching market chart:", err.message);
    res.status(500).json({ error: "Failed to fetch market chart" });
  }
});

// Add NewsAPI integration
// Get recent news for a coin
router.get('/:id/news', async (req, res) => {
  try {
    // Get coin name from CoinGecko
    const { data: coin } = await axios.get(`${BASE}/coins/${req.params.id}`, {
      params: { localization: false }
    });
    const query = coin.name;
    const newsRes = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: NEWS_API_KEY,
        pageSize: 5,
      },
    });
    res.json(newsRes.data);
  } catch (err) {
    console.error('Error fetching news:', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get sentiment score for a coin based on news headlines
router.get('/:id/sentiment', async (req, res) => {
  try {
    // Get coin name from CoinGecko
    const { data: coin } = await axios.get(`${BASE}/coins/${req.params.id}`, {
      params: { localization: false }
    });
    const query = coin.name;
    const newsRes = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: NEWS_API_KEY,
        pageSize: 5,
      },
    });
    const headlines = (newsRes.data.articles || []).map(a => a.title);
    const sentiment = new Sentiment();
    const scores = headlines.map(h => sentiment.analyze(h).score);
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    let label = 'neutral';
    if (avg > 1) label = 'positive';
    else if (avg < -1) label = 'negative';
    res.json({ score: avg, label });
  } catch (err) {
    console.error('Error fetching sentiment:', err.message);
    res.status(500).json({ error: 'Failed to fetch sentiment' });
  }
});

export default router;
