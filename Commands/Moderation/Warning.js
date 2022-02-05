const Discord = require("discord.js");
const DB = require("../../Database/Schema/WarningDB")

module.exports = {
    name: "warning",
    usage: [""],
    enabled: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["ADMINISTRAOR"],
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
            const member = !args[0] ? null : await client.tools.resolveMember(args[0], message.guild);
            // Load the user
            const reason = (() => {
                if (args.length == 1) {
                    return ("No reason provided");
                } else {
                    const reason = args.join(' ');
                    return reason.replace(args[0], '');
                }
            })();
            const user = member.user;
            DB.findOne({
                GuildID: message.guild.id,
                UserID: user.id,
                UserTag: user.tag,
            }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    data = new warningdb({
                        GuildID: message.guild.id,
                        UserID: user.id,
                        UserTag: user.tag,
                        content: [{
                            Moderator: message.author.id,
                            Reason: reason
                        }]
                    })
                } else {
                    const object = {
                        moderator: message.author.id,
                        reason: reason
                    }
                    data.content.push(object)
                }
                data.save()

            })

            message.channel.send('Warned the user!')
            user.send('You have been warned!')

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