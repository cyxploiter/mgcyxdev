const client = require("../../cyx");

client.on("guildMemberAdd", async (member) => {
    if (member.user.bot) return;
    const guild = member.guild;
    const data = await client.Database.fetchGuild(guild.id);
    if (!data.addons.network.enabled) return;
    const network = data.addons.network.netMessage;

    member.send(`our networks:\n\n${network}`).catch(() => {});

});