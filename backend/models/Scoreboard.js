const mongoose = require("mongoose");
const scoreboardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    draws: {
        type: Number,
        default: 0
    },
    score: {
        type: String,
        default: ""
    }
});
module.exports = mongoose.model("Scoreboard", scoreboardSchema);