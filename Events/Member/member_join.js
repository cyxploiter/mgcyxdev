const client = require("../../cyx");
const Discord = require("discord.js");

client.on("guildMemberAdd", async (member) => {

    if (member.user.bot) return;

    if (member.guild.id === "885977110911545424") {
        return member.roles.add("938346436158959666");
    };
});