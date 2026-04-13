const Scoreboard = require("./Scoreboard.js");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
    }
});
userSchema.post("save", async function (doc) {
    console.log("User created:", doc._id);

    const existing = await Scoreboard.findOne({ userId: doc._id });

    if (!existing) {
        await Scoreboard.create({
            userId: doc._id,
            Username: doc.userName
        });


    }
});
module.exports = mongoose.models.User || mongoose.model("User", userSchema);