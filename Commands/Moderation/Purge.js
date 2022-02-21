const Discord = require("discord.js");

module.exports = {
    name: "purge",
    usage: ["Purge messages from a channel. ```{prefix}purge <amount>```", "Purge messages from a channel. ```{prefix}purge <amount> <channel>```"],
    enabled: true,
    hidden: false,
    aliases: ["prune", "clear"],
    category: "Moderation",
    memberPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 5000,

    /**
     *  @param {Discord.Client} client
     *  @param {Discord.Message} message
     * @param {String[]} args
     * @param {Object} data
     **/

    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {
            if (!args[1]) {
                const amount = args[0];
                const channel = message.channel;
                if (!amount) return client.embed.usage(message, data);
                if (amount > 100) return client.embed.send(message, {
                    title: "Error",
                    description: "You can only purge up to 100 messages at a time.",
                });
                if (amount < 1) return client.embed.send(message, {
                    title: "Error",
                    description: "You can only purge at least 1 message.",
                });
                channel.bulkDelete(amount, true).then(() => {
                    const Embed = new Discord.MessageEmbed()
                        .setColor("WHITE")
                        .setTitle("Purged!")
                        .setDescription(`Successfully purged ${amount} messages in ${channel}.`);
                    channel.send({
                        embeds: [Embed]
                    });
                });
            } else {
                const amount = args[0];
                const channel = message.channel;
                if (!amount) return client.embed.usage(message, data);
                if (amount > 100) return client.embed.send(message, {
                    title: "Error",
                    description: "You can only purge up to 100 messages at a time.",
                });
                if (amount < 1) return client.embed.send(message, {
                    title: "Error",
                    description: "You can only purge at least 1 message.",
                });
                const member = await (async () => {
                    if (args[1].match(/^<@!?(\d+)>$/)) {
                        const member = !args[1] ? null : await client.tools.resolveMember(args[1], message.guild);
                        return member;
                    } else if (args[1].match(/\d{0,18}/)) {
                        return args[1].match(/\d{0,18}/)[0];
                    }
                })();

                const messages = await channel.messages.fetch();
                const filterBy = member ? member.id : member.user.id;
                const userMessages = messages.filter((m) => m.author.id === member || m.author.id === filterBy).toJSON().slice(0, amount);
                channel.bulkDelete(userMessages).then(async () => {
                    const Embed = await new Discord.MessageEmbed()
                        .setColor("WHITE")
                        .setTitle("Purged!")
                        .setDescription(`Successfully purged ${amount} messages from ${member}.`);
                    channel.send({
                        embeds: [Embed]
                    });
                });
            }
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