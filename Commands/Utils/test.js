const Discord = require("discord.js");

module.exports = {
    name: "test",
    usage: [""],
    enabled: true,
    aliases: [],
    category: "Utils",
    memberPermissions: [],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
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
    async execute(client, message, args, data){
        try{
            let textChans = await message.guild.channels.cache.filter(channel => channel.type == 'GUILD_TEXT').size;
            let voiceChans = await message.guild.channels.cache.filter(channel => channel.type == 'GUILD_VOICE').size;

            let catCount = message.guild.channels.cache.filter(channel => channel.type == 'GUILD_CATEGORY');

            console.log(textChans, voiceChans, catCount)
        }catch(err){
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