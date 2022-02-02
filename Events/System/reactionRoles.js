const {
    MessageEmbed
} = require("discord.js");
const client = require("../../cyx");
const db = require('../../Database/Schema/ReactionRoles');


client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.partial) {
        let rolemap = reaction.message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r.id)
            .join("-");
        if (!rolemap) rolemap = "No roles";
        const roles = rolemap.split('-')

        roles.forEach((roleid) => {
            db.findOne({
                GuildId: reaction.message.guild.id,
                MessageId: reaction.message.id,
                Roles: roleid,
                Emote: reaction.emoji.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) return
                const member = reaction.message.guild.members.cache.get(user.id);
                const role = reaction.message.guild.roles.cache.get(data.Roles);
                if (data.Type == "Reverse") {
                    return member.roles.remove(role).then(() => {
                        reaction.message.guild.channels.cache.get("938379359188844574").send({
                            embeds: [new MessageEmbed().setColor("WHITE").setDescription(`**${member.user.tag}** self removed\nRole: ${role}`).setTimestamp()]
                        })
                    });
                }
                await member.roles.add(role).then(() => {
                    reaction.message.guild.channels.cache.get("938379359188844574").send({
                        embeds: [new MessageEmbed().setColor("WHITE").setDescription(`**${member.user.tag}** self assigned\nRole: ${role}`).setTimestamp()]
                    })
                });
            });
        });
    } else {
        let rolemap = reaction.message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r.id)
            .join("-");
        if (!rolemap) rolemap = "No roles";
        const roles = rolemap.split('-');

        roles.forEach((roleid) => {
            db.findOne({
                GuildId: reaction.message.guild.id,
                MessageId: reaction.message.id,
                Roles: roleid,
                Emote: reaction.emoji.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) return;
                const member = reaction.message.guild.members.cache.get(user.id);
                const role = reaction.message.guild.roles.cache.get(data.Roles);
                if (data.Type == "Reverse") {
                    return member.roles.remove(role).then(() => {
                        reaction.message.guild.channels.cache.get("938379359188844574").send({
                            embeds: [new MessageEmbed().setColor("WHITE").setDescription(`**${member.user.tag}** self removed\nRole: ${role}`).setTimestamp()]
                        })
                    });
                }
                await member.roles.add(role).then(() => {
                    reaction.message.guild.channels.cache.get("938379359188844574").send({
                        embeds: [new MessageEmbed().setColor("WHITE").setDescription(`**${member.user.tag}** self assigned\nRole: ${role}`).setTimestamp()]
                    })
                });;
            });
        });
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (reaction.message.partial) {
        let rolemap = reaction.message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r.id)
            .join("-");
        if (!rolemap) rolemap = "No roles";

        const roles = rolemap.split('-')

        roles.forEach((roleid) => {
            db.findOne({
                GuildId: reaction.message.guild.id,
                MessageId: reaction.message.id,
                Roles: roleid,
                Emote: reaction.emoji.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) return;
                const member = reaction.message.guild.members.cache.get(user.id);
                const role = reaction.message.guild.roles.cache.get(data.Roles);
                if (data.Type == "Reverse") {
                    return member.roles.add(role).then(() => {
                        reaction.message.guild.channels.cache.get("938379359188844574").send({
                            embeds: [new MessageEmbed().setColor("WHITE").setDescription(`**${member.user.tag}** self assigned\nRole: ${role}`).setTimestamp()]
                        })
                    });
                }
                if (member && role) {
                    await member.roles.remove(role).then(() => {
                        reaction.message.guild.channels.cache.get("938379359188844574").send({
                            embeds: [new MessageEmbed().setColor("WHITE").setDescription(`**${member.user.tag}** self removed\nRole: ${role}`).setTimestamp()]
                        })
                    });
                }
            });
        });
    } else {
        let rolemap = reaction.message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r.id)
            .join("-");
        if (!rolemap) rolemap = "No roles";
        const roles = rolemap.split('-');

        roles.forEach((roleid) => {
            db.findOne({
                GuildId: reaction.message.guild.id,
                MessageId: reaction.message.id,
                Roles: roleid,
                Emote: reaction.emoji.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) return;
                const member = reaction.message.guild.members.cache.get(user.id);
                const role = reaction.message.guild.roles.cache.get(data.Roles);
                if (data.Type == "Reverse") {
                    return member.roles.add(role).then(() => {
                        reaction.message.guild.channels.cache.get("938379359188844574").send({
                            embeds: [new MessageEmbed().setColor("WHITE").setDescription(`**${member.user.tag}** self assigned\nRole: ${role}`).setTimestamp()]
                        })
                    });
                }
                if (member && role) {
                    await member.roles.remove(role).then(() => {
                        reaction.message.guild.channels.cache.get("938379359188844574").send({
                            embeds: [new MessageEmbed().setColor("WHITE").setDescription(`**${member.user.tag}** self removed\nRole: ${role}`).setTimestamp()]
                        })
                    });;
                }
            });
        });
    }
});