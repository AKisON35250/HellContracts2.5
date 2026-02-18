import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));

// __dirname Fix für ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Statische Dateien =====
app.use(express.static(path.join(__dirname, "public")));

// ===== HTML Routes =====
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "marktplatz.html"));
});

app.get("/mission", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "mission.html"));
});

// ===== Discord Mission Endpoint =====
app.post("/send-mission", async (req, res) => {
    if (!process.env.DISCORD_WEBHOOK_MISSION) {
        return res.status(500).json({ error: "Mission Webhook nicht gesetzt" });
    }

    if (!req.body || !req.body.embeds) {
        return res.status(400).json({ error: "Body oder Embeds fehlen" });
    }

    try {
        const response = await fetch(process.env.DISCORD_WEBHOOK_MISSION, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const text = await response.text();

        if (!response.ok) {
            console.log("Discord Mission Fehler:", text);
            return res.status(400).json({ error: text });
        }

        res.json({ success: true });

    } catch (err) {
        console.log("Server Mission Fehler:", err);
        res.status(500).json({ error: "Server Fehler" });
    }
});

// ===== Discord Market Endpoint =====
app.post("/send-market", async (req, res) => {
    if (!process.env.DISCORD_WEBHOOK_MARKET) {
        return res.status(500).json({ error: "Market Webhook nicht gesetzt" });
    }

    if (!req.body || !req.body.embeds) {
        return res.status(400).json({ error: "Body oder Embeds fehlen" });
    }

    try {
        const response = await fetch(process.env.DISCORD_WEBHOOK_MARKET, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const text = await response.text();

        if (!response.ok) {
            console.log("Discord Market Fehler:", text);
            return res.status(400).json({ error: text });
        }

        res.json({ success: true });

    } catch (err) {
        console.log("Server Market Fehler:", err);
        res.status(500).json({ error: "Server Fehler" });
    }
});

// ===== Server starten =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));


