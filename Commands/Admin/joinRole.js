const Discord = require("discord.js");

module.exports = {
    name: "joinrole",
    usage: ["Assigns a role to a user when they join the server. ```{prefix}jr <role>```"],
    enabled: true,
    hidden: false,
    aliases: ["jr"],
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
            const subCommands = ["add", "remove", "list"];
            if (!args[0]) {
                return client.embed.send(message,
                    new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle("Please specify a subcommand!")
                    .addField("Available Subcommands", "`add`: Adds a role to a user when they join the server.\n`remove`: Removes a role from a user when they join the server.\n`list`: Lists all roles that are assigned to a user when they join the server.")
                );
            }

            if (args[0] === "add") {
                if (!args[1]) {
                    return client.embed.send(message,
                        new Discord.MessageEmbed()
                        .setColor("RED")
                        .setTitle("Please specify a role!")
                    );
                }
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