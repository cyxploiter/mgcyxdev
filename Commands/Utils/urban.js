const Discord = require("discord.js");
const urban = require("urban-dictionary");

module.exports = {
    name: "urban",
    usage: ["Search for a word on Urban Dictionary```{prefix}urban [word]```"],
    enabled: true,
    hidden: false,
    aliases: ["ud", "urbandictionary"],
    category: "Utils",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 10000,

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {

            if (!args[0]) {
                return client.embed.send(message, {
                    description: `Please provide a word to search for.`,
                    color: `RED`,

                });
            }

            let word = args.join(" ");

            urban.define(word, function (error, entries, tags, sounds) {
                if (error) {
                    return client.embed.send(message, {
                        description: `An error occured while searching for the word.`,
                        color: `RED`,

                    });
                }

                if (entries.length === 0) {
                    return client.embed.send(message, {
                        description: `No results found for the word.`,
                        color: `RED`,

                    });
                }

                let word = entries[0].word;

                let embed = new Discord.MessageEmbed()
                    .setTitle(`${entries[0].word} Urban Dictionary`)
                    .setColor(`WHITE`)
                    .setURL(`https://www.urbandictionary.com/define.php?term=${word}`)
                    .setDescription(`**${entries[0].word}**\n\n${entries[0].definition}`)
                    .addField(`Example`, `${entries[0].example}`)
                    .addField(`Author`, `${entries[0].author}`)
                    .addField(`Rating`, `${entries[0].thumbs_up} :thumbsup: | ${entries[0].thumbs_down} :thumbsdown:`);

                return client.embed.send(message, embed);
            });
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