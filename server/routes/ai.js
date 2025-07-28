import express from "express";
const router = express.Router();

router.post("/analyze", (req, res) => {
  const { holdings } = req.body;
  const result = holdings.map(({ coin, amount }) =>
    `You have ${amount} of ${coin.toUpperCase()}; risk is ${amount > 100 ? "high" : "low"}.`
  );
  res.json({ result });
});

export default router;
