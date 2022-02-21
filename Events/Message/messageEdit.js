const client = require("../../cyx");
const Discord = require("discord.js");

client.on("messageUpdate", async (oldMessage, newMessage) => {
    const guild = newMessage.guild;
    const guildData = await client.Database.fetchGuild(guild.id);
    const logsChannel = await client.tools.resolveChannel(guildData.addons.logger.channel, guild);
    if (oldMessage.partial) {
        const delLogEmbed = new Discord.MessageEmbed()
            .setColor("BLACK")
            .setDescription(
                `${newMessage.author} edited an uncached message.`
            )
            .setTimestamp();
        return logsChannel.send({
                embeds: [delLogEmbed],
            })
            .catch((err) => console.log(err));
    }
    if (oldMessage.author.bot || oldMessage.channel.type === "DM") return;
    if (oldMessage.content == newMessage.content) return;


    const count = 1950;
    const original = oldMessage.content.slice(0, count) + (oldMessage.content.length > count ? " ..." : "");
    const edited = newMessage.content.length > count ? `${newMessage.content.substr(0, count)}...` : newMessage.content;

    const logEmbed = new Discord.MessageEmbed()
        .setColor("GREY")
        .setDescription(
            `${oldMessage.author} edited [message](${newMessage.url}) in ${newMessage.channel}.\n\n**Original:**\n${original}\n**Edited:**\n${edited}`
        )
        .setTimestamp();
    logsChannel.send({
            embeds: [logEmbed],
        })
        .catch((err) => console.log(err));

});