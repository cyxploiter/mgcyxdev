const Discord = require("discord.js");
const axios = require("axios");
const fetch = require("node-fetch");

module.exports = {
    name: "serveravatar",
    usage: ["Gets server avatar ```{prefix}sav```", "Gets member's server avatar ```{prefix}sav @user```"],
    enabled: true,
    hidden: false,
    aliases: ["sav"],
    category: "",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 10000,

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {
            if (!args) {
                return client.embed.send(message, {
                    title: `${message.guild.name} server avatar`,
                    fields: [{
                        name: 'Links as',
                        value: `[.webp](${message.guild.iconURL({ dynamic: true })})`
                    }],
                    image: {
                        url: `${message.guild.iconURL({ dynamic: true })}?size=4096`
                    }
                });
            }

            // Find user from guild cache
            let member = !args[0] ? null : await client.tools.resolveMember(args[0], message.guild);
            // Load the user
            let user = (!args[0] || !member) ? message.author : member.user;
            let res = await fetch(`https://discord.com/api/guilds/${message.guild.id}/members/${user.id}`, {
                headers: {
                    Authorization: `Bot ${client.config.token}`
                }
            }).then(res => res.json());
            console.log(res);
            if (!res || !res.avatar) {
                return client.embed.send(message, {
                    description: `${user} doesnt have server avatar.`,
                    color: `WHITE`,
                })
            };
            const extension = res.avatar.startsWith("a_") ? '.gif?size=4096' : '.png?size=4096';
            const url = `https://cdn.discordapp.com/guilds/${message.guild.id}/users/${user.id}/avatars/${res.avatar}${extension}`;
            return client.embed.send(message, {
                title: `${user.username} server avatar`,
                fields: [{
                    name: 'Links as',
                    value: `[${res.avatar.startsWith("a_") ? '.gif' : '.png'}](${url})`
                }],
                image: {
                    url: `${url}`
                }
            });

        } catch (err) {
            client.logger.error(`Ran into an error while executing ${data.cmd.name}`)
            console.log(err)
            return client.embed.send(message, {
                description: `An issue has occured while running the command.If this error keeps occuring please contact our development team.`,
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