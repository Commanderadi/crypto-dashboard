import express from "express";
import { analyzePortfolio } from "../services/gemini.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  const { holdings } = req.body;
  const result = await analyzePortfolio(holdings);
  res.json({ result });
});

export default router;
