const Discord = require("discord.js");

module.exports = {
    name: "snipe",
    usage: ["Snipes the last deleted message from the channel.```{prefix}snipe```"],
    enabled: true,
    hidden: false,
    aliases: [],
    category: "Utils",
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
            const snipes = client.snipes.get(message.channel.id);
            if (!snipes) return message.reply("Hm? sadly we don't have nothing to snipe yet.")

            const {
                msg,
                time,
                image
            } = snipes[0];
            if (!image) {
                return client.embed.send(message, {
                    description: `${msg.content}`,
                    footer: {
                        text: `${msg.author.tag} | ${time}`
                    }
                })
            }
            return client.embed.send(message, {
                description: `${msg.content}`,
                footer: {
                    text: `${msg.author.tag} | ${time}`
                },
                image: {
                    url: image
                }
            });

        } catch (err) {
            client.logger.error(`Ran into an error while executing ${data.cmd.name}`)
            console.log(err)
            return client.embed.send(message, {
                description: `An issue has occured while running the command. If this error keeps occuring please contact our development team.`,
                color: `RED`,
                author: {
                    name: `Uh Oh!`,
                    icon_url: `${message.author.displayAvatarURL({dynamic: true})}`,
                    url: "",
                }
            });
        }
    }
}