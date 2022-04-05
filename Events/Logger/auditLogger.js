const client = require("../../cyx");
const Discord = require("discord.js");

client.on("", async (message) => {
    try {
        let guild = message.guild;
        let guildData = await client.Database.fetchGuild(guild.id);
        if (!guildData.addons.auditlogger.enabled) return;
        let logsChannel = await client.tools.resolveChannel(guildData.addons.auditlogger.channel, guild);


    } catch (err) {
        client.logger.error(`Ran into an error while executing ${data.cmd.name}`)
        console.log(err)
        return client.embed.send(message, {
            description: `An issue has occured while logging a deleted message. If this error keeps occuring please contact our development team.`,
            color: `RED`,
            author: {
                name: `Uh Oh!`,
                icon_url: `${client.user.displayAvatarURL()}`,
                url: "",
            }
        });
    }
});