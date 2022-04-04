const Discord = require("discord.js");
const DB = require("../../Database/Schema/ReactionRoles")
module.exports = {
    name: "addreactrole",
    usage: ["Add reaction role to a message", "```{prefix}arr <messageId> <emote> <role>```"],
    enabled: true,
    hidden: false,
    aliases: ["arr"],
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
            if (!args[0] || args.length < 3) {
                return client.embed.usage(message, data);
            }

            const fetchedMessage = await message.channel.messages.fetch(args[0]).catch((err) => {
                message.reply("pls enter a valid messageId and use command in the channel where message was sent!")
                return;
            });
            if (!fetchedMessage) return;
            fetchedMessage.react(args[1]);
            const emoteRegex = /<:.+:(\d+)>/gm
            const animatedEmoteRegex = /<a:.+:(\d+)>/gm
            const user = message.guild.members.cache.get(message.author.id);
            const roleEmote = (() => {
                if (args[1].match(/<a?:.+:\d+>/gm)) {
                    if (emoji = emoteRegex.exec(args[1])) {
                        return emoji[1]
                    } else if (emoji = animatedEmoteRegex.exec(args[1])) {
                        return emoji[1]
                    }
                } else {
                    return encodeURIComponent(args[1]);
                }
            })();
            console.log(roleEmote);
            const role = message.guild.roles.cache.get(args[2].split(/(\d+)/g)[1]);
            const roleid = args[2].split(/(\d+)/g)[1]

            await DB.create({
                GuildId: message.guild.id,
                MessageId: fetchedMessage.id,
                Roles: roleid,
                Emote: roleEmote,
                Type: ""
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