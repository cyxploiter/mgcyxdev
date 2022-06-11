const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "test",
    usage: [""],
    enabled: true,
    hidden: true,
    aliases: [],
    category: "",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
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
            message.author.send({
                content: `https://discord.gg/YCjR7REv4w`,
                components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setURL("https://discord.gg/YCjR7REv4w").setLabel("Pls consider joining box").setStyle("LINK"), new Discord.MessageButton().setLabel(`Sent from ${message.guild.name}`).setStyle("SECONDARY").setCustomId("sentFrom").setDisabled(true))]
            }).catch(err => {
                console.log(err)
            });

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