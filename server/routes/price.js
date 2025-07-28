import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/:coinId", async (req, res) => {
  const { coinId } = req.params;
  try {
    const result = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    res.json(result.data);
  } catch {
    res.status(500).json({ error: "Failed to fetch price" });
  }
});

export default router;
