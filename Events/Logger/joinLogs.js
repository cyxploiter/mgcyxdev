const client = require("../../cyx");
const Discord = require("discord.js");
const moment = require("moment");

const InvitesTracker = require('@androz2091/discord-invites-tracker');
const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});

tracker.on('guildMemberAdd', async (member, type, invite) => {

    try {
        let guild = member.guild;
        let guildData = await client.Database.fetchGuild(guild.id);
        if (!guildData.addons.invitelogger.enabled) return;
        let logsChannel = await client.tools.resolveChannel(guildData.addons.invitelogger.channel, guild);
        const logEmbed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL({
                dynamic: true
            }));
        if (type == 'normal') {
            logEmbed.addFields({
                name: `${member.user.tag} joined the server.`,
                value: `User ID: ${member.user.id} | Registered At: ${moment(member.user.createdAt)}`,

            }, {
                name: `Invite`,
                value: `${invite.code} | ${`Used ${invite.uses} times` || 'Never Used'} | ${invite.maxUses || 'Unlimited'} uses | ${invite.maxAge || 'Unlimited'} days | Created by ${invite.inviter.tag}`,
            })
            return logsChannel.send({
                embeds: [logEmbed]
            });
        } else if (type == 'vanity') {

            const vanity = (await (member.guild.fetchVanityData()));
            logEmbed.addFields({
                name: `${member.user.tag} joined using vanity.`,
                value: `User ID: ${member.user.id} | Registered At: ${moment(member.user.createdAt)}`,
            }, {
                name: `Vanity`,
                value: `Vanity code: ${vanity.code} | Vanity Uses: ${vanity.uses}`,
            })
            return logsChannel.send({
                embeds: [logEmbed]
            });
        } else if (type == 'unknown') {
            logEmbed.addFields({
                name: `${member.user.tag} joined but couldn't find how.`,
                value: `User ID: ${member.user.id} | Registered At: ${moment(member.user.createdAt)}`,
                inline: true
            });

            return logsChannel.send({
                embeds: [logEmbed]
            });
        }
    } catch (err) {
        client.logger.error(`Ran into an error while executing joinLogs.js`);
        console.log(err)
        client.embed.error({
            title: `An issue has occured while executing event joinLogs.js in guild ${member.guild.name}`,
            description: `**Error:**\n${err.stack}`,
            color: `RED`,
        })
    };
});