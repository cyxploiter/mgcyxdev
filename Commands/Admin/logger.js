const Discord = require("discord.js");

module.exports = {
    name: "logger",
    usage: ["Sends deleted and edited message in selected channel. ```{prefix}logger set #channel```", "To disable message logger```{prefix}logger disable```"],
    enabled: true,
    hidden: false,
    aliases: [],
    category: "Admin",
    memberPermissions: ["ADMINISTRATOR"],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 5000,


    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {
            if (!args[0]) {
                return client.embed.usage(message, data);
            };

            if (!data.guild.addons.logger) {
                data.guild.addons.logger = {
                    enabled: false,
                    channel: ""
                }
                data.guild.markModified('addons.logger');
                await data.guild.save();
            };


            if (args[0].toLowerCase() === "disable") {

                data.guild.addons.logger.enabled = false;
                data.guild.markModified('addons.logger');
                await data.guild.save();
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Message Logger disabled',
                    description: `Message Logger has been disabled.`
                });
            };

            if (args[0].toLowerCase() === "set") {
                let channel = await client.tools.resolveChannel(args[1], message.guild);
                if (!channel) return message.channel.send("Unable to find the mentioned channel");

                data.guild.addons.logger.enabled = true;
                data.guild.addons.logger.channel = channel.id;
                data.guild.markModified('addons.logger');
                await data.guild.save();

                // Return success message to user
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Channel set',
                    description: `Deleted and Edited messages will be sent to ${channel}`
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