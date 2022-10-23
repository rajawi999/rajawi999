const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
userId: { type: String, required: true, unique: true },
discordTag: { type: String, required: true },
accessToken: { type: String, required: true },
type: { type: String, required: true },
refreshToken: { type: String, required: true }
});

const User = mongoose.model("users", UserSchema);

module.exports = User;