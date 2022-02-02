const Discord = require("discord.js");
const DB = require("../../Database/Schema/ReactionRoles")
module.exports = {
    name: "rmreactrole",
    usage: ["Add reverse reaction role to a message", "```{prefix}rmrr <messageId> <role>```"],
    enabled: true,
    aliases: ["rmrr"],
    category: "Admin",
    memberPermissions: ["ADMINISTRATOR"],
    botPermissions: ["MANAGE_ROLES", "SEND_MESSAGES", "EMBED_LINKS"],
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
            if (!args[0] || args.length < 2) {
                return client.embed.usage(message, data);
            }
            const fetchedMessage = await message.channel.messages.fetch(args[0]).catch((err) => {
                message.reply("pls enter a valid messageId and use command in the channel where message was sent!")
                return;
            });
            const roleid = args[1].split(/(\d+)/g)[1]
            if (!fetchedMessage) return;
            await DB.findOne({
                GuildId: message.guild.id,
                MessageId: fetchedMessage.id,
                Roles: roleid,
            }, async (err, data) => {
                if (err) throw err;
                console.log(data)
                const Emote = data.Emote;
                fetchedMessage.reactions.resolve(Emote).remove(Emote);
            });
            await DB.deleteOne({
                GuildId: message.guild.id,
                MessageId: fetchedMessage.id,
                Roles: roleid,
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