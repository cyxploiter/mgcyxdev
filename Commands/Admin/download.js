const download = require('download-chromium')
const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "downchrom",
    usage: [""],
    enabled: true,
    hidden: true,
    aliases: [],
    category: "",
    memberPermissions: ["ADMINISTRATOR"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {Discord.Interaction} interaction
     * @param {String[]} args
     */

    // Execute contains content for the command
    async execute(client, interaction, message, args, data) {
        try {

            const exec = await download()
            console.log(`Downloaded Chromium to ${exec}`)

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