import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const flagged = req.body.transactions.filter(tx => tx.amount >= 10000);
  res.json({
    message: flagged.length ? "🚨 Flagged" : "✅ Clean",
    flagged
  });
});

export default router;
