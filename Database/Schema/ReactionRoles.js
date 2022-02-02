const {
    model,
    Schema
} = require("mongoose");

module.exports = model("reactionRoles", new Schema({
    GuildId: String,
    MessageId: String,
    Roles: String,
    Emote: String,
    Type: String
}));