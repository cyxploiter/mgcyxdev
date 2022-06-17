const Discord = require("discord.js");
const client = require("../../cyx");
const moment = require("moment");

client.on("guildMemberRemove", async member => {
    try {
        let guild = member.guild;
        let guildData = await client.Database.fetchGuild(guild.id);
        if (!guildData.addons.invitelogger.enabled) return;
        let logsChannel = await client.tools.resolveChannel(guildData.addons.invitelogger.channel, guild);
        const roles = member.roles.cache.map(r => r);
        const logEmbed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true
            }));
        logEmbed.addFields({
            name: `${member.user.tag} left the server.`,
            value: `User ID: ${member.user.id}`,
        }, {
            name: `Joined At:`,
            value: `${moment(member.joinedAt).format("MMMM Do YYYY, HH:mm:ss")} | ${moment(member.joinedAt).startOf("day").fromNow()}`,
            inline: true
        }, {
            name: `Registered At:`,
            value: `${moment(member.user.createdAt).format("MMMM Do YYYY, HH:mm:ss")}`,
            inline: true
        }, {
            name: `Roles:`,
            value: `${roles.join(" ")}`,
        });

        return logsChannel.send({
            embeds: [logEmbed]
        });
    } catch (err) {
        client.logger.error(err);
    }
});