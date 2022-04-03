const Discord = require("discord.js");
const DB = require("../../Database/Schema/afk");

module.exports = {
    name: "afk",
    usage: ["Set your AFK status", "```{prefix}afk <status>```"],
    enabled: true,
    hidden: false,
    aliases: [],
    category: "General",
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
            const user = message.author;
            const status = message.content;
            const afkStatus = status.replace(`${data.guild.prefix}afk`, "");
            const embed = new Discord.MessageEmbed()
                .setAuthor({
                    name: `${user.tag}`,
                    iconURL: user.displayAvatarURL({
                        dynamic: true
                    })
                });
            DB.find({
                GuildID: message.guild.id,
                UserID: user.id,
                Status: afkStatus
            });
            await DB.findOneAndUpdate({
                GuildID: message.guild.id,
                UserID: user.id
            }, {
                Status: afkStatus
            }, {
                new: true,
                upsert: true
            });


            if (!afkStatus) {
                embed.setColor("WHITE").setDescription(`Your AFK has been set!\nI'll notify if someone pings you.`);
            } else {
                embed.setColor("WHITE").setDescription(`Your AFK has been set:${afkStatus}\nI'll notify if someone pings you.`);
            }
            message.reply({
                embeds: [embed]
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
};