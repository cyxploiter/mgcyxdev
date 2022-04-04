const Discord = require("discord.js");

module.exports = {
    name: "getguilds",
    usage: [""],
    enabled: true,
    hidden: true,
    aliases: [],
    category: "",
    memberPermissions: [],
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
            const invites = [];

            //cant use async inside of forEach 
            //https://www.coreycleary.me/why-does-async-await-in-a-foreach-not-actually-await/
            for (const [guildID, guild] of client.guilds.cache) {
                //if no invite was able to be created or fetched default to string
                let invite = "No invite";

                //fetch already made invites first
                const fetch = await guild.invites.fetch().catch(() => undefined);

                //if fetch worked and there is atleast one invite
                if (fetch && fetch.size) {
                    invite = fetch.first().url;
                    invites.push({
                        name: guild.name,
                        invite
                    });
                    continue;
                }

                if (!invite && channel.createInvite) {
                    const attempt = await channel.createInvite({
                        maxAge: 0,
                        maxUses: 0
                    }).catch(() => undefined);

                    if (attempt) {
                        invite = attempt.url;
                    }
                }


                invites.push({
                    name: guild.name,
                    invite
                });
            }

            const embed = new Discord.MessageEmbed()
                .setColor(
                    "WHITE"
                )
                .setTitle(`${client.user.username} Guilds`)
                .setDescription(invites.map(invite => `[${invite.name}](${invite.invite})`).join("\n"))
            message.reply({
                embeds: [embed]
            })
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