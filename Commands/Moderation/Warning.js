const Discord = require("discord.js");
const DB = require("../../Database/Schema/WarningDB")

module.exports = {
    name: "warning",
    usage: ["Warn a member for rule exploitation. ```{prefix}warn <@user/userId>```", "Check member warnings ```{prefix}warn check <@user/userId>```", "Remove a warning from member.```{prefix}warn remove <@user/userId> <warnId>```", "Remove all the warnings from member```{prefix}warn clear <@user/userId>```"],
    enabled: true,
    hidden: false,
    aliases: ["warn"],
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
            const subCommand = args[0]
            if (subCommand === "check") {
                const member = !args[1] ? null : await client.tools.resolveMember(args[1], message.guild);
                const user = member.user;
                if (!member) return client.embed.usage(message, data);
                DB.findOne({
                    GuildID: message.guild.id,
                    UserID: user.id,
                    UserTag: user.tag,
                }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        return client.embed.send(message, {
                            title: `${user.tag} Warnings`,
                            description: `${data.Content.map((w, i) => `**ID**: ${i + 1}\n**By**: ${w.ExcuterTag}\n**Date**: ${w.Date}\n**Reason**: ${w.Reason}\n`).join((" "))}`,
                        });
                    } else {
                        return client.embed.send(message, {
                            title: `${user.tag} Warnings`,
                            description: `${user.tag} | ${user.id} has no warnings.`,
                        });
                    }
                })
            } else if (subCommand === "remove") {
                const member = !args[1] ? null : await client.tools.resolveMember(args[1], message.guild);
                const user = member.user;
                const WarnID = args[2];
                if (!WarnID) return client.embed.usage(message, data);
                DB.findOne({
                    GuildID: message.guild.id,
                    UserID: user.id,
                    UserTag: user.tag,
                }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        data.Content.splice(WarnID, 1)
                        data.save();
                        return client.embed.send(message, {
                            title: `Warning Removed!`,
                            description: `1 warning has been removed from ${user.tag}.`,
                        });
                    } else {
                        return client.embed.send(message, {
                            title: `${user.tag} Warnings`,
                            description: `${user.tag} | ${user.id} has no warnings.`,
                        });
                    }
                })
            } else if (subCommand === "clear") {
                const member = !args[1] ? null : await client.tools.resolveMember(args[1], message.guild);
                const user = member.user;
                DB.findOneAndDelete({
                    GuildID: message.guild.id,
                    UserID: user.id,
                    UserTag: user.tag,
                }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        return client.embed.send(message, {
                            title: `Warnings Removed!`,
                            description: `All warnings has been removed from ${user.tag}.`,
                        });
                    } else {
                        return client.embed.send(message, {
                            title: `${user.tag} Warnings`,
                            description: `${user.tag} | ${user.id} has no warnings.`,
                        });
                    }
                });
            } else {
                const member = !args[0] ? null : await client.tools.resolveMember(args[0], message.guild);
                const warnDate = new Date(message.createdTimestamp).toLocaleDateString();
                const reason = (() => {
                    if (args.length == 1) {
                        return ("No reason provided");
                    } else {
                        const reason = args.join(' ');
                        return reason.replace(args[0], '');
                    }
                })();
                if (!member) return client.embed.usage(message, data);
                const user = member.user;
                await DB.findOne({
                    GuildID: message.guild.id,
                    UserID: user.id,
                    UserTag: user.tag,
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        data = new DB({
                            GuildID: message.guild.id,
                            UserID: user.id,
                            UserTag: user.tag,
                            Content: [{
                                ExcuterID: message.author.id,
                                ExcuterTag: message.author.tag,
                                Reason: reason,
                                Date: warnDate
                            }]
                        })
                    } else {
                        const object = {
                            ExcuterID: message.author.id,
                            ExcuterTag: message.author.tag,
                            Reason: reason,
                            Date: warnDate
                        }
                        data.Content.push(object)
                    }
                    data.save()
                });

                await user.send({
                    embeds: [{
                        title: `You have been warned!`,
                        description: `You have been warned in ${message.guild.name} for: ${reason}`,
                        color: "RED",
                        timestamp: new Date(),
                        footer: {
                            text: `Warned by ${message.author.tag}`
                        }
                    }]
                });


                return client.embed.send(message, {
                    title: `Warned! ${user.tag}`,
                    description: `Warning added: ${user.tag} | ${user.id}\nReason: ${reason}`,
                });
            };
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