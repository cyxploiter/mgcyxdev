const Discord = require("discord.js");
var Scraper = require('images-scraper');
const resultMap = require('../../Maps/imgResMap');

const google = new Scraper({
    puppeteer: {
        headless: true,
    },
});

module.exports = {
    name: "image",
    usage: ["Search for an image on google.", "```{prefix}img <search>```"],
    enabled: true,
    hidden: true,
    aliases: ["img"],
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
            if (!args[0]) return message.reply("Please enter a search term.");
            const searchResult = await google.scrape(args.join(" "), 100);

            if (!searchResult) return message.reply("No results found. for query: " + args.join(" "));

            const Button = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setLabel("Next")
                    .setEmoji("⏩")
                    .setStyle("SECONDARY")
                    .setCustomId("imgNext")
                );

            const Embed = new Discord.MessageEmbed()
                .setColor("WHITE")
                .setTitle(`Search results for ${args.join(" ")}`)
                .setDescription(`${searchResult.length} results found.`)
                .setImage(searchResult[0].url)
                .setFooter({
                    text: `Result 1 of ${Math.ceil(searchResult.length)}`
                });

            const response = await message.reply({
                embeds: [Embed],
                components: [Button]
            })

            return await resultMap.set(response.id, searchResult);

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
};