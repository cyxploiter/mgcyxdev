const client = require("../../cyx");
const Discord = require("discord.js");



client.on("messageDelete", async (message) => {
    try {
        let guild = message.guild;
        let guildData = await client.Database.fetchGuild(guild.id);
        if (!guildData.addons.logger.enabled) return;
        let logsChannel = await client.tools.resolveChannel(guildData.addons.logger.channel, guild);
        if (message.partial) {
            const delLogEmbed = new Discord.MessageEmbed()
                .setColor("BLACK")
                .setDescription(
                    `Someone deleted an uncached message.`
                )
                .setTimestamp();
            return logsChannel.send({
                    embeds: [delLogEmbed],
                })
                .catch((err) => console.log(err));
        }
        const fetchedAutditLog = await message.guild.fetchAuditLogs({
            limit: 5,
            type: "MESSAGE_DELETE",
        });
        const auditEntry = fetchedAutditLog.entries.filter(entry => entry.target.id === message.author.id && entry.extra.channel.id === message.channel.id && entry.createdTimestamp > (Date.now() - 10000));

        const executor = (() => {
            if (auditEntry.size > 0) {
                return auditEntry.first().executor ? "Bot" : "Unknown";
            } else {
                return message.author;
            }
        })();
        if (!logsChannel) return;

        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        const delLogEmbed = new Discord.MessageEmbed()
            .setColor("DARKER_GREY")
            .setDescription(
                `${executor} deleted a [message](${message.url}) in ${message.channel
            }\n\n**Deleted Message:**\n ${message.content ? message.content : "No message content"
            }`
            )
            .setTimestamp()
            .setFooter({
                text: `Author ID: ${message.author.id} | MessageID: ${message.id}`,
            });


        if (message.attachments.size > 0) {
            const Attachments = message.attachments;
            let embeds = [];
            let AttachmentsList = [];
            Attachments.forEach((attachment) => {
                AttachmentsList.push(
                    new Discord.MessageAttachment()
                    .setFile(attachment.proxyURL).setName(attachment.name)
                );
                embeds.push(
                    new Discord.MessageEmbed()
                    .setColor("DARKER_GREY")
                    .setDescription(
                        `${executor} deleted a [message](${message.url}) in ${message.channel
                            }\n\n**Deleted Message:**\n ${message.content ? message.content : "No message content"
                            }`
                    )
                    .setTimestamp()
                    .setImage(`attachment://${attachment.name}`)
                    .setFooter({
                        text: `Author ID: ${message.author.id} | MessageID: ${message.id}`,
                    })
                );
            });
            return logsChannel.send({
                embeds: embeds,
                files: AttachmentsList,
            }).catch((err) => console.log(err));
        };
        logsChannel.send({
            embeds: [delLogEmbed]
        });

    } catch (err) {
        console.log(err)
        });
    }
});
