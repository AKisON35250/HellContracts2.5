import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json({ limit: "1mb" }));

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Statische HTML-Dateien
app.use(express.static(path.join(__dirname, "public")));

// Routen
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "marktplatz.html")));
app.get("/mission", (req, res) => res.sendFile(path.join(__dirname, "public", "mission.html")));

// POST Marktplatz
app.post("/send-market", async (req, res) => {
  if (!process.env.DISCORD_WEBHOOK_MARKET) return res.status(500).json({ error: "Market Webhook nicht gesetzt" });
  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_MARKET, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    if (!response.ok) return res.status(400).json({ error: text });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Mission
app.post("/send-mission", async (req, res) => {
  if (!process.env.DISCORD_WEBHOOK_MISSION) return res.status(500).json({ error: "Mission Webhook nicht gesetzt" });
  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_MISSION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    if (!response.ok) return res.status(400).json({ error: text });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));

