import express from "express";
import getFreeGames from "../scraper/free-games.js";
import getMysteryGames from "../scraper/mystery-games.js"; // New import

const router = express.Router();

router.get("/free-games", async (req, res) => {
    try {
        const games = await getFreeGames();
        res.status(200).json({ success: true, data: games });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching free games" });
    }
});

router.get("/mystery-games", async (req, res) => {
    try {
        const games = await getMysteryGames();
        res.status(200).json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching mystery games",
            error: error.message
        });
    }
});

export default router;