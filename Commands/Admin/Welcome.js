const Discord = require("discord.js");

module.exports = {
    name: "welcome",
    usage: ["When a user joins the server, send message to channel.", "Set channel for the welcome message```{prefix}welcome set #channel```", "Set up a custom welcome message```{prefix}welcome custom <text>```", "Disable the welcome message```{prefix}welcome disable```", "Disable the welcome message```{prefix}welcome disable```", "Test the welcome message```{prefix}welcome test```", "Get all the variables```{prefix}welcome variables```"],
    enabled: true,
    hidden: false,
    aliases: ["welc"],
    category: "Admin",
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
            // If no arguments then return usage error
            if (!args[0]) {
                return client.embed.usage(message, data);
            };

            const subCommands = ["set", "custom", "disable", "test", "variables", "vars"];
            if (!subCommands.includes(args[0].toLowerCase())) {
                console.log(args)
                return client.embed.usage(message, data);
            };

            if (args[0] === "variables" || args[0] === "vars") {
                return client.embed.send(message, {
                    title: "Welcome Variables",
                    description: "```\n" +
                        "{user.ping} - Ping the user that joined the server\n" +
                        "{user.name} - Name of joined user\n" +
                        "{user.id} - ID of joined user\n" +
                        "{user.tag} - Tag of joined user\n" +
                        "{guild.name} - Name of the server\n" +
                        "{guild.id} - ID of the server\n" +
                        "{guild.totalUser} - Amount of members in the server\n" +
                        "```",
                    footer: {
                        text: `All variables are case sensitive.`
                    }
                })
            };

            // If addon for welcome is missing create it
            if (!data.guild.addons.welcome) {
                data.guild.addons.welcome = {
                    enabled: false,
                    channel: "",
                    message: "",
                    image: false,
                    embed: false
                }
                data.guild.markModified('addons.welcome');
                await data.guild.save();
            };

            // Disable welcome messages
            if (args[0].toLowerCase() === "disable") {
                // Disable the welcome messages
                data.guild.addons.welcome.enabled = false;
                data.guild.markModified('addons.welcome');
                await data.guild.save();
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Welcome disabled',
                    description: `Welcome messages have been disabled.`
                });
            };

            if (args[0].toLowerCase() === "test") {
                // If welcome messages are disabled or channel isn't set return error
                if (!data.guild.addons.welcome.enabled || data.guild.addons.welcome.channel.trim() === "") {
                    return message.reply('Welcome messages are currently disabled.')
                }

                // Find the channel
                let channel = await client.tools.resolveChannel(data.guild.addons.welcome.channel, message.guild);
                let welcomeMsg = (data.guild.addons.welcome.message === null || data.guild.addons.welcome.message === "" || data.guild.addons.welcome.message === " ") ? "Welcome! {user.ping}" : data.guild.addons.welcome.message; // Get the custom message or use the preset one

                // Replace all valid tags
                let fmsg = await welcomeMsg
                    .replace("{user.ping}", `${message.author}`)
                    .replace("{user.name}", `${message.author.username}`)
                    .replace("{user.id}", `${message.author.id}`)
                    .replace("{user.tag}", `${message.author.tag}`)
                    .replace("{guild.name}", `${message.guild.name}`)
                    .replace("{guild.id}", `${message.guild.id}`)
                    .replace("{guild.totalUser}", `${message.guild.memberCount}`);

                return channel.send(fmsg);
            };

            // Return usage error as users missing arguments
            if (!args[1]) {
                return client.embed.usage(message, data);
            };

            // Set up welcome messages
            if (args[0].toLowerCase() === "set") {
                // Find the mentioned channel
                let channel = await client.tools.resolveChannel(args[1], message.guild);
                if (!channel) return message.channel.send("Unable to find the mentioned channel");

                // Enable welcome message and save channel
                data.guild.addons.welcome.enabled = true;
                data.guild.addons.welcome.channel = channel.id;
                data.guild.markModified('addons.welcome');
                await data.guild.save();

                // Return success message to user
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Channel set',
                    description: `Welcome messages will be sent to ${channel}`
                });
            };

            // Set up custom message for welcome messages
            if (args[0].toLowerCase() === "custom") {
                // Join arguments into a string
                let msg = args.slice(1).join(" ");
                // Save the message to the database
                data.guild.addons.welcome.message = msg;
                data.guild.markModified('addons.welcome');
                await data.guild.save();

                // Return success message to user
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Message set',
                    description: `Welcome message has been set to: \`${msg}\``
                });
            };






            // None of the requirements were met so return usage error
            return client.embed.usage(message, data);


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