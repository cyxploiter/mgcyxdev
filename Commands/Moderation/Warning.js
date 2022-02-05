const Discord = require("discord.js");
const DB = require("../../Database/Schema/WarningDB")

module.exports = {
    name: "warning",
    usage: [""],
    enabled: false,
    hidden: true,
    aliases: [],
    category: "Moderation",
    memberPermissions: ["KICK_MEMBERS", "MANAGE_ROLES"],
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
            const warnDate = new Date(message.createdTimestamp).toLocaleDateString;
            const reason = (() => {
                if (args.length == 1) {
                    return ("No reason provided");
                } else {
                    const reason = args.join(' ');
                    return reason.replace(args[0], '');
                }
            })();
            const user = member.user;
            await DB.findOne({
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
                        Content: [{
                            ExcuterID: message.author.id,
                            ExcuterTag: message.author.tag,
                            Reason: reason,
                            Date: date
                        }]
                    })
                } else {
                    const object = {
                        ExcuterID: message.author.id,
                        ExcuterTag: message.author.tag,
                        Reason: reason,
                        Date: date
                    }
                    data.Content.push(object)
                }
                data.save()
            });


            return client.embed.send(message, {
                title: `Warned ${user.tag}`,
                description: `Warning added: ${user.tag} || ${user.id}\nReason: ${reason}`,
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