module.exports = {
    name: "avatar",
    usage: ["Get a users avatar```{prefix}avatar <@user>```"],
    enabled: true,
    hidden: false,
    aliases: ["av"],
    category: "General",
    memberPermissions: [],
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
            // Find user from guild cache
            let member = !args[0] ? null : await client.tools.resolveMember(args[0], message.guild);
            // Load the user
            let user = (!args[0] || !member) ? message.author : member.user;
            const avatar = user.displayAvatarURL({
                dynamic: true
            });
            const extension = avatar.includes("a_") ? 'GIF' : 'PNG';

            extension.includes("GIF") ? client.embed.send(message, {
                title: `Avatar of ${user.username}`,
                fields: [{
                    name: 'Links as',
                    value: `[.gif](${user.displayAvatarURL({ dynamic: true })})`
                }],
                image: {
                    url: `${user.displayAvatarURL({dynamic: true})}?size=4096`
                }
            }) : client.embed.send(message, {
                title: `Avatar of ${user.username}`,
                fields: [{
                    name: 'Links as',
                    value: `[.webp](${user.displayAvatarURL()})`
                }],
                image: {
                    url: `${user.displayAvatarURL({dynamic: true})}?size=4096`
                }
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