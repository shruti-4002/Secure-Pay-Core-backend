const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to blacklist"],
        unique: true, 
    },
    blacklistedAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    }
}, {
    timestamps: true
});

// TTL Index: 3days (60*60*24*3 seconds)
tokenBlacklistSchema.index({ createdAt: 1 }, {
    expiresAfterSeconds: 60 * 60 * 24 * 3 
});


const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

module.exports = TokenBlacklist;