const express = require("express");
const Scoreboard = require("../models/Scoreboard");
const router = express.Router();
router.post("/scoreboard", async (req, res) => {
    const { userId, score, username } = req.body;

    try {
        const fieldMap = {
            win: "wins",
            loss: "losses",
            draw: "draws"
        };

        const field = fieldMap[score];

        if (!field) {
            return res.status(400).json({ message: "Invalid score" });
        }

        const updatedScoreboard = await Scoreboard.findOneAndUpdate(
            { userId },
            {
                $inc: { [field]: 1 },
                $setOnInsert: { Username: username } // 🔥 الحل هون
            },
            { new: true, upsert: true }
        );

        res.json({ message: "Scoreboard updated", scoreboard: updatedScoreboard });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/scoreboard/rankings", async (req, res) => {
    try {
        const { userId } = req.query; 

        const topPlayers = await Scoreboard.find()
            .populate("userId", "userName")
            .sort({ wins: -1 })
            .limit(10);

        let currentUserRank = null;

        if (userId) {
            const all = await Scoreboard.find().sort({ wins: -1 });

            const index = all.findIndex(
                (p) => p.userId.toString() === userId
            );

            if (index !== -1) {
                const userScore = await Scoreboard.findOne({ userId })
                    .populate("userId", "userName");

                currentUserRank = {
                    rank: index + 1,
                    ...userScore._doc,
                };
            }
        }

        res.json({
            top10: topPlayers,
            currentUser: currentUserRank,
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;