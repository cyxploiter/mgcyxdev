const client = require("../../cyx");

client.on("guildMemberAdd", async (member) => {
    if (member.guild.id === "885977110911545424") {
        return member.roles.add("938346436158959666");
    };
});