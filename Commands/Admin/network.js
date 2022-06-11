const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "network",
    usage: ["DMs networked servers to user on join ```{prefix}network help```"],
    enabled: true,
    hidden: false,
    aliases: ["net"],
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
            if (args.length < 1) {
                return message.reply(`Please specify a command. \`${data.guild.prefix}network help\``);
            }

            if (args[0].toLowerCase() === "help") {
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor(`WHITE`)
                    .setTitle(`Network Help`)
                    .setDescription(`This command is used to network within the servers.`)
                    .addField(`${client.config.prefix}network enable`, `This command will enable the network system.`)
                    .addField(`${client.config.prefix}network disable`, `This command will disable the network system.`)
                    .addField(`${client.config.prefix}network add <server>`, `This command will add the server to the network.`)
                    .addField(`${client.config.prefix}network remove <server>`, `This command will remove the server from the network.`)
                    .addField(`${client.config.prefix}network list`, `This command will list all the servers in the network.`);
                return client.embed.message(message, helpEmbed);
            }

            if (args[0].toLowerCase() === "enable") {
                data.guild.addons.network.enabled = true;
                data.guild.markModified('addons.network');
                await data.guild.save();
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Network enabled',
                    description: `Network system has been enabled.`
                });
            }

            if (args[0].toLowerCase() === "disable") {
                data.guild.addons.network.enabled = false;
                data.guild.markModified('addons.network');
                await data.guild.save();
                return client.embed.send(message, {
                    color: client.config.color,
                    title: 'Network disabled',
                    description: `Network system has been disabled.`
                });
            }

            if (args[0].toLowerCase() === "add") {
                const invCode = args[1];
                const invite = await fetch(`https://discordapp.com/api/invite/${invCode}`).then(res => res.json());

                if (!invite.guild) {
                    return message.reply(`${message.author}, that is not a valid server link!`);
                };

                if (data.guild.addons.network.netMessage.includes(`https://discord.gg/${invite.code}\n`)) {
                    return client.embed.send(message, {
                        color: client.config.color,
                        title: 'Server already in network',
                        description: `${invite.guild.name} is already in the network.`,
                        thumbnail: `
                        https: //cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}`
                    });
                }


                data.guild.addons.network.netMessage += `https://discord.gg/${invite.code}\n`;
                data.guild.markModified('addons.network');
                await data.guild.save();

                const embed = new Discord.MessageEmbed()
                    .setColor(`WHITE`)
                    .setTitle(`${invite.guild.name}`)
                    .setURL(`https://discordapp.com/invite/${invCode}`)
                    .setThumbnail(`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}`)
                    .setDescription(`Server added to net: ${invite.guild.name}`)
                    .setTimestamp();

                return client.embed.send(message, embed);
            }

            if (args[0].toLowerCase() === "remove") {
                const invCode = args[1];

                if (!data.guild.addons.network.netMessage.includes(`https://discord.gg/${invCode}`)) {
                    return message.reply(`Provided server vanity (${invCode}) is not in the network!`);
                }
                const invite = await fetch(`https://discordapp.com/api/invite/${invCode}`).then(res => res.json());


                data.guild.addons.network.netMessage = data.guild.addons.network.netMessage.replace(`https://discord.gg/${invite.code}\n`, ``);
                data.guild.markModified('addons.network');
                await data.guild.save();


                const embed = new Discord.MessageEmbed()
                    .setColor(`WHITE`)
                    .setTitle(`${invite.guild.name}`)
                    .setURL(`https: //discordapp.com/api/invite/${invCode}`)
                    .setThumbnail(`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}`)
                    .setDescription(`Server removed from net: ${invite.guild.name}`)
                    .setTimestamp();

                return client.embed.send(message, embed);
            }

            if (args[0].toLowerCase() === "list") {
                const embed = new Discord.MessageEmbed()
                    .setColor(`WHITE`)
                    .setTitle(`Networked Servers`)
                    .setDescription(`${data.guild.addons.network.netMessage}`)
                    .setTimestamp();
                return client.embed.send(message, embed);
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