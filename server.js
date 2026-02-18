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

// Static Files (deine HTML Dateien im public Ordner)
app.use(express.static(path.join(__dirname, "public")));


// ===============================
// Mission Endpoint
// ===============================
app.post("/send-mission", async (req, res) => {

    if (!process.env.DISCORD_WEBHOOK_MISSION) {
        return res.status(500).json({ error: "Mission Webhook nicht gesetzt" });
    }

    try {
        const response = await fetch(process.env.DISCORD_WEBHOOK_MISSION, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            return res.status(500).json({ error: "Discord Fehler (Mission)" });
        }

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: "Server Fehler (Mission)" });
    }
});


// ===============================
// Marktplatz Endpoint
// ===============================
app.post("/send-market", async (req, res) => {

    if (!process.env.DISCORD_WEBHOOK_MARKET) {
        return res.status(500).json({ error: "Market Webhook nicht gesetzt" });
    }

    try {
        const response = await fetch(process.env.DISCORD_WEBHOOK_MARKET, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            return res.status(500).json({ error: "Discord Fehler (Market)" });
        }

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: "Server Fehler (Market)" });
    }
});


// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server läuft auf Port", PORT);
});
