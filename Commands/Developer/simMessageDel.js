const Discord = require("discord.js");

module.exports = {
    name: "simdel",
    usage: ["Simulate a message delete"],
    enabled: true,
    hidden: true,
    aliases: [],
    category: "",
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
            const fakemessage = new Discord.Message(client, {
                id: message.id,
                channel: {
                    id: message.channel.id,
                    type: "text",
                    guild: message.guild,
                },
                content: "This is a test message"
            });
            client.emit('messageDelete', fakemessage);

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