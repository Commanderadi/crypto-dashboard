import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.post("/", (req, res) => {
  const { coin, price } = req.body;

  exec(`python ../ml/predict.py ${coin} ${price}`, (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: "Prediction failed" });
    }
    res.json({ prediction: stdout.trim() });
  });
});

export default router;
