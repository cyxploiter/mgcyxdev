const client = require("../../cyx");
const Discord = require("discord.js");

client.on("messageEdit", async (oldMessage, newMessage) => {
    try {
        let guild = newMessage.guild;
        let guildData = await client.Database.fetchGuild(guild.id);
        if (!guildData.addons.logger.enabled) return;
        let logsChannel = await client.tools.resolveChannel(guildData.addons.logger.channel, guild);
        if (oldMessage.partial) {
            const logEmbed = new Discord.MessageEmbed()
                .setColor("BLACK")
                .setDescription(
                    `Someone edited an uncached message.`
                )
                .setTimestamp();
            return logsChannel.send({
                    embeds: [logEmbed],
                })
                .catch((err) => console.log(err));
        };
        if (!logsChannel) return;

        if (newMessage.author.bot) return;
        if (newMessage.channel.type === "dm") return;

        const logEmbed = new Discord.MessageEmbed()
            .setColor("DARKER_GREY")
            .setDescription(
                `${executor} edited a [message](${newMessage.url}) in ${newMessage.channel
                }\n\n**Old Message:**\n ${oldMessage.content ? oldMessage.content : "No message content"
                }\n\n**New Message:**\n ${newMessage.content ? newMessage.content : "No message content"
                }`
            )
            .setTimestamp()
            .setFooter({
                text: `Author ID: ${newMessage.author.id} | MessageID: ${newMessage.id}`,
            });
    } catch (err) {
        console.log(err);
    }
});