const {
    MessageEmbed
} = require("discord.js");
const client = require("../../cyx");
const db = require('../../Database/Schema/afk');

client.on("messageCreate", async (message) => {
    const Embed = new MessageEmbed()
    if (message.author.bot || message.channel.type === "DM") return;

    db.findOne({
        GuildID: message.guild.id,
        UserID: message.author.id
    }, async (err, data) => {
        if (err) throw err;
        if (!data) return;
        if (data.UserID === message.author.id) {
            await db.deleteOne({
                GuildID: message.guild.id,
                UserID: message.author.id
            });
            Embed.setColor("WHITE").setDescription(`Your AFK has been removed.`)
            return message.reply({
                embeds: [Embed]
            });
        }
    });


    if (message.mentions.members.size) {
        message.mentions.members.forEach((m) => {
            db.findOne({
                GuildID: message.guild.id,
                UserID: m.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) return;
                console.log(data);
                if (!data.Status) {
                    Embed.setDescription(`${m} is currently AFK.`).setColor("DARKER_GREY");
                } else {

                    Embed.setDescription(`${m} is currently AFK.\n**Status:**${data.Status}`).setColor("DARKER_GREY");
                }
                return message.reply({
                    embeds: [Embed]
                });
            })
        })
    }
});