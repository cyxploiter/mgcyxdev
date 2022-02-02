const client = require("../../cyx");

client.on("guildMemberAdd", async (member) => {
    member.roles.add("938346436158959666")
})