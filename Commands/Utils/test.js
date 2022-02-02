const Discord = require("discord.js");

module.exports = {
    name: "test",
    usage: [""],
    enabled: true,
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
            const fetchedMessage = await message.channel.messages.fetch(args[0])
            const filterBy = "931289932989886494";
            const reactions = await fetchedMessage.reactions.cache.filter(r => r.toJSON);
            console.log(reactions)
            fetchedMessage.reactions.resolve(filterBy).remove(filterBy)
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