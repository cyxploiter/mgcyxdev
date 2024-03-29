const Discord = require("discord.js");

module.exports = {
    name: "invite",
    usage: ["Sends the invitation link in DMs.```{prefix}invite```"],
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
            const url = `https://discord.com/api/oauth2/authorize?client_id=${client.application.id}&permissions=8&scope=bot%20applications.commands`;
            const embed = new Discord.MessageEmbed()
                .setColor("WHITE")
                .setAuthor({
                    name: `Invite link for ${client.user.username}`,
                    iconURL: client.application.iconURL()
                })
                .setDescription(`[Click here to invite me to your server!](${url})`);
            message.author.send({
                embeds: [embed]
            }).then((m) => {}).catch((err) => {
                message.reply(`${message.author}, I couldn't send you the invite link because you have DMs disabled.`);
            });

            return client.embed.send(message, {
                title: "Invite link sent!",
                description: `Check your DMs!`,
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