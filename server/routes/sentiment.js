import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  const { news } = req.body;

  // Placeholder: Always return neutral
  res.json({
    sentiment: "neutral",
    confidence: 0.5,
    message: "Sentiment analysis module coming soon.",
  });
});

export default router;
