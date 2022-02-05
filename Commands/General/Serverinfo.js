const moment = require('moment');
const Discord = require("discord.js");



module.exports = {
    name: "serverinfo",
    usage: ["Get information about the current server```{prefix}serverinfo```"],
    enabled: true,
    hidden: false,
    aliases: [],
    category: "General",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 5000,

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {

            // Use moment to convert ms to date
            let createDate = await moment(message.guild.createdAt).format('MMMM Do YYYY, HH:mm:ss');


            let textChans = await message.guild.channels.cache.filter(channel => channel.type == 'GUILD_TEXT').size;
            let voiceChans = await message.guild.channels.cache.filter(channel => channel.type == 'GUILD_VOICE').size;
            // Get the amount of role
            let roleCount = await message.guild.roles.cache.size;

            let verifyLevel = await message.guild.verificationLevel.toLowerCase();
            verifyLevel = verifyLevel.charAt(0).toUpperCase() + verifyLevel.slice(1);
            // Get the amount of banned users
            let banCount = await (await message.guild.bans.fetch()).size;

            // Add the information to the embed
            const perksLevel = (() => {
                if (message.guild.premiumTier == 'TIER_1') return "1";
                if (message.guild.premiumTier == 'TIER_2') return "2";
                if (message.guild.premiumTier == 'TIER_3') return "3";
                else return "0";
            })();
            return client.embed.send(message, {
                author: {
                    name: message.guild.name,
                    icon_url: message.guild.iconURL({
                        dynamic: true
                    }),
                    url: '',
                },
                fields: [{
                        name: `Server ID`,
                        value: `${message.guild.id}`,
                        inline: false
                    },
                    {
                        name: `Verification Level`,
                        value: verifyLevel,
                        inline: true
                    },
                    {
                        name: `Guild Created`,
                        value: createDate,
                        inline: false
                    },
                    {
                        name: `Server Owner`,
                        value: `${(await message.guild.fetchOwner()).user} [${message.guild.ownerId}]`,
                        inline: false
                    },
                    {
                        name: `Channels [${textChans + voiceChans}]`,
                        value: `Text: ${textChans}\nVoice: ${voiceChans}`,
                        inline: true
                    },
                    {
                        name: `Roles [${roleCount}]`,
                        value: `\`${data.guild.prefix}roles\` - For more information`,
                        inline: false
                    },
                    {
                        name: `Bans`,
                        value: `${banCount}`,
                        inline: false
                    },
                    {
                        name: `Server Boosts`,
                        value: `Level: ${perksLevel}\nAmount: ${message.guild.premiumSubscriptionCount || 0}`,
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