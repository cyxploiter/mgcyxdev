const moment = require('moment');
const Discord = require('discord.js')

module.exports = {
    name: "userinfo",
    usage: ["Get information about your profile```{prefix}userinfo <@user/userId>```"],
    enabled: true,
    hidden: false,
    aliases: ["ui"],
    category: "General",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 5000,
    /**
     * 
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */
    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {
            // Get member from guild
            let member = !args[0] ? await client.tools.resolveMember(message.author.id, message.guild) : await client.tools.resolveMember(args[0], message.guild)
            if (!member) return client.embed.usage(message, data);
            // Get a list of roles
            let roleCount = await member.roles.cache.map(x => "<@&" + x.id + ">").join(" ");
            // Get joined date for member
            let joinDate = await moment(member.joinedTimestamp).format('MMMM Do YYYY, HH:mm:ss');
            // Get user account create date
            let createDate = await moment(member.user.createdTimestamp).format('MMMM Do YYYY, HH:mm:ss');

            // Add the information to the embed
            return client.embed.send(message, {
                author: {
                    name: member.user.tag,
                },
                thumbnail: {
                    url: member.user.displayAvatarURL({
                        dynamic: true
                    }),
                },
                fields: [{
                        name: `User`,
                        value: `${member.user} [${member.user.id}]`,
                        inline: false
                    },
                    {
                        name: `Created At`,
                        value: `${createDate} | ${moment(member.user.createdAt).startOf("day").fromNow()}`,
                        inline: false
                    },
                    {
                        name: `Joined At`,
                        value: `${joinDate} | ${
                            moment(member.joinedAt).startOf("day").fromNow()
                        }`,
                        inline: false
                    },
                    {
                        name: `Roles`,
                        value: roleCount,
                        inline: false
                    },
                ]
            })

        } catch (err) {
            client.logger.error(`Ran into an error while executing ${data.cmd.name}`)
            console.log(err)
            return client.embed.send(message, {
                description: `An issue has occured while running the command. If this error keeps occuring please contact our development team.`,
                color: `RED`,
                author: {
                    name: `Uh Oh!`,
                    icon_url: `${message.author.displayAvatarURL()}`,
                    url: "",
                }
            });
        }
    }
}