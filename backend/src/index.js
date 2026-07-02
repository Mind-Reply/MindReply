import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "mindreply-backend",
    time: new Date().toISOString()
  });
});

// Core decision endpoint (placeholder)
app.post("/api/decide", (req, res) => {
  const { input } = req.body;

  return res.json({
    input,
    decision: "processed",
    nextStep: "workflow_pending",
    timestamp: Date.now()
  });
});

app.listen(PORT, () => {
  console.log(`MindReply backend running on port ${PORT}`);
});
