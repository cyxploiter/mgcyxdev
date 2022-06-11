const Discord = require("discord.js");

module.exports = {
    name: "statusrole",
    usage: ["Adds a role if they have specified word or link in their status ```{prefix}statusrole @role```", "Adds words for the role ```{prefix}statusrole add <word>```", "To disable the status role, use ```{prefix}statusrole disable```"],
    enabled: true,
    hidden: false,
    aliases: ["sr"],
    category: "Admin",
    memberPermissions: ["ADMINISTRATOR"],
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
            if (!args[0]) {
                return client.embed.usage(message, data);
            };

            if (!data.guild.addons.statusrole) {
                data.guild.addons.statusrole = {
                    enabled: false,
                    role: "",
                    filter: ""
                }
                data.guild.markModified('addons.logger');
                await data.guild.save();
            };


            if (args[0].toLowerCase() === "disable") {

                data.guild.addons.statusrole.enabled = false;
                data.guild.addons.statusrole.filter = "";
                data.guild.markModified('addons.statusrole');
                await data.guild.save();
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Status role disabled',
                    description: `Status role system has been disabled.`
                });
            };

            if (args[0].toLowerCase() === "set") {
                let role = await client.tools.resolveRole(args[1], message.guild);
                if (!role) return message.reply("Unable to find the mentioned role");

                data.guild.addons.statusrole.enabled = true;
                data.guild.addons.statusrole.role = role.id;
                data.guild.markModified('addons.statusrole');
                await data.guild.save();

                // Return success message to user
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Role set',
                    description: `Status role has been set to ${role}`
                });
            };

            if (args[0].toLowerCase() === "set") {

                if (!data.guild.addons.statusrole.enabled) return message.reply("Status role is not enabled");
                const word = args.slice(1).join(" ");
                if (!word) return message.reply("Please specify a word");

                data.guild.addons.statusrole.filter = `${word}`;
                data.guild.markModified('addons.statusrole');
                await data.guild.save();

                // Return success message to user
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Word added',
                    description: ` Members will now be assigned the role ${await client.tools.resolveRole(data.guild.addons.statusrole.role, message.guild)} when they have the word \`${word}\` in their status.`
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