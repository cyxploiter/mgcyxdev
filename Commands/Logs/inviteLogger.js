const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "joinlogger",
    usage: [""],
    enabled: true,
    hidden: false,
    aliases: ["invlogs"],
    category: "Logs",
    memberPermissions: ["ADMINISTRATOR"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 0,

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {
            if (!args[0]) {
                return client.embed.usage(message, data);
            };

            if (!data.guild.addons.invitelogger) {
                data.guild.addons.invitelogger = {
                    enabled: false,
                    channel: ""
                }
                data.guild.markModified('addons.invitelogger');
                await data.guild.save();
            };


            if (args[0].toLowerCase() === "disable") {

                data.guild.addons.invitelogger.enabled = false;
                data.guild.markModified('addons.invitelogger');
                await data.guild.save();
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Disabled Invite Logger',
                    description: `Invite Logger has been disabled.`
                });
            };

            if (args[0].toLowerCase() === "set") {
                let channel = await client.tools.resolveChannel(args[1], message.guild);
                if (!channel) return message.channel.send("Unable to find the mentioned channel");

                data.guild.addons.invitelogger.enabled = true;
                data.guild.addons.invitelogger.channel = channel.id;
                data.guild.markModified('addons.invitelogger');
                await data.guild.save();

                // Return success message to user
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Channel set',
                    description: `Invite logs will be shown in ${channel}`
                });
            };
        } catch (err) {
            client.invitelogger.error(`Ran into an error while executing ${data.cmd.name}`)
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