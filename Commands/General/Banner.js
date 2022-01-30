const Discord = require("discord.js");
const {
    default: axios
} = require("axios");

module.exports = {
    name: "banner",
    usage: ["Get a users banner```{prefix}banner <@user>```"],
    enabled: true,
    aliases: ["ba"],
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
            // Find user from guild cache
            let member = !args[0] ? null : await client.tools.resolveMember(args[0], message.guild);
            // Load the user
            let user = (!args[0] || !member) ? message.author : member.user;
            const userData = await axios
                .get(`https://discord.com/api/users/${user.id}`, {
                    headers: {
                        Authorization: `Bot ${client.token}`,
                    },
                });
            const {
                banner
            } = userData.data;
            if (!banner) return message.reply({
                content: `<@${user.id}> is so fucking broke, cant even afford $10 nitro `
            });

            const extension = banner.startsWith("a_") ? ".gif?size=4096" : ".webp?size=4096";
            const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`;
            return extension.includes(".gif") ? client.embed.send(message, {
                title: `Banner of ${user.username}`,
                fields: [{
                    name: 'Links as',
                    value: `[.gif](${bannerUrl})`
                }],
                image: {
                    url: `${bannerUrl}`
                }
            }) : client.embed.send(message, {
                title: `Banner of ${user.username}`,
                fields: [{
                    name: 'Links as',
                    value: `[.webp](${bannerUrl})`
                }],
                image: {
                    url: `${bannerUrl}`
                }
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