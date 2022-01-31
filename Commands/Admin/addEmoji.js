const Discord = require("discord.js");

module.exports = {
    name: "steal",
    usage: ["Adds a specified emoji to the server", "```{prefix}steal <emoji>```"],
    enabled: true,
    aliases: [],
    category: "Admin",
    memberPermissions: ["ADMINISTRATOR"],
    botPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {
            const hasEmoteRegex = /<a?:.+:\d+>/gm
            if (!message.content.match(hasEmoteRegex)) return client.embed.usage(message, data);
            const emoteRegex = /<:.+:(\d+)>/gm
            const animatedEmoteRegex = /<a:.+:(\d+)>/gm
            const emoteNameRegex = /<(a?):(.+):(\d+)>/u;
            if (emoji = emoteRegex.exec(message)) {
                const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".png"
                const emoteName = (() => {
                    return emoteNameRegex.exec(emoji[0])[2]
                })();
                console.log(emoteName)
                message.guild.emojis.create(url, `dys_${emoteName}`)
            } else if (emoji = animatedEmoteRegex.exec(message)) {
                const url = "https://cdn.discordapp.com/emojis/" + emoji[1] + ".gif"
                const emoteName = (() => {
                    return emoteNameRegex.exec(emoji[0])[2]
                })();
                console.log(emoteName)
                message.guild.emojis.create(url, `adys_${emoteName}`)
            }
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