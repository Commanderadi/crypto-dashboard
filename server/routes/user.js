import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const users = [];
const watchlists = {};
const portfolios = {};
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });
  if (users.find(u => u.username === username))
    return res.status(400).json({ error: "Username already exists" });
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash });
  res.json({ message: "User registered" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

// Middleware to authenticate JWT
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Get watchlist
router.get("/watchlist", auth, (req, res) => {
  const username = req.user.username;
  res.json({ watchlist: watchlists[username] || [] });
});

// Add to watchlist
router.post("/watchlist", auth, (req, res) => {
  const username = req.user.username;
  const { coinId } = req.body;
  if (!coinId) return res.status(400).json({ error: "coinId required" });
  if (!watchlists[username]) watchlists[username] = [];
  if (!watchlists[username].includes(coinId)) watchlists[username].push(coinId);
  res.json({ watchlist: watchlists[username] });
});

// Remove from watchlist
router.delete("/watchlist", auth, (req, res) => {
  const username = req.user.username;
  const { coinId } = req.body;
  if (!coinId) return res.status(400).json({ error: "coinId required" });
  if (!watchlists[username]) watchlists[username] = [];
  watchlists[username] = watchlists[username].filter(id => id !== coinId);
  res.json({ watchlist: watchlists[username] });
});

// Get portfolio
router.get("/portfolio", auth, (req, res) => {
  const username = req.user.username;
  res.json({ portfolio: portfolios[username] || [] });
});

// Add/update holding
router.post("/portfolio", auth, (req, res) => {
  const username = req.user.username;
  const { coinId, amount } = req.body;
  if (!coinId || typeof amount !== 'number') return res.status(400).json({ error: "coinId and amount required" });
  if (!portfolios[username]) portfolios[username] = [];
  const idx = portfolios[username].findIndex(h => h.coinId === coinId);
  if (idx >= 0) portfolios[username][idx].amount = amount;
  else portfolios[username].push({ coinId, amount });
  res.json({ portfolio: portfolios[username] });
});

// Remove holding
router.delete("/portfolio", auth, (req, res) => {
  const username = req.user.username;
  const { coinId } = req.body;
  if (!coinId) return res.status(400).json({ error: "coinId required" });
  if (!portfolios[username]) portfolios[username] = [];
  portfolios[username] = portfolios[username].filter(h => h.coinId !== coinId);
  res.json({ portfolio: portfolios[username] });
});

export default router; 