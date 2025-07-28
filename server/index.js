import express from "express";
import cors from "cors";
import coinsRoutes from "./routes/coin.js";
import aiRoutes from "./routes/ai.js";
import fraudRoutes from "./routes/fraud.js";
import userRoutes from "./routes/user.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/coins", coinsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/fraud", fraudRoutes);
app.use("/api/user", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
