const Discord = require('discord.js');
const resultMap = require('../Maps/imgResMap');

module.exports = {
    label: 'Next',
    customId: 'imgNext',

    /**
     * @param {Discord.Client} client
     * @param {Discord.Interaction} interaction
     * @param {Discord.Message} message
     */

    async execute(interaction, client, message) {
        const searchResult = await resultMap.get(message.id);
        if (!searchResult) return interaction.reply({
            content: `No results were found. Try searching again.`,
            ephemeral: true
        });
        const searchResultSize = await searchResult.length;
        const searchResultIndex = searchResult.findIndex(x => x.url === message.embeds[0].image.url);
        const searchResultIndexNext = searchResultIndex + 1;
        const searchResultIndexNextCheck = searchResultIndexNext < searchResultSize;

        if (searchResultIndexNextCheck) {



            const Embed = new Discord.MessageEmbed()
                .setTitle(`${message.embeds[0].title}`)
                .setColor("WHITE")
                .setDescription(`${searchResult.length} results found.`)
                .setImage(searchResult[searchResultIndexNext].url)
                .setFooter({
                    text: `Result ${searchResultIndexNext + 1} of ${searchResultSize}`
                });

            const Button = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setLabel("Previous")
                    .setEmoji("⏪")
                    .setStyle("SECONDARY")
                    .setCustomId("imgPrev"),

                    new Discord.MessageButton()
                    .setLabel("Next")
                    .setEmoji("⏩")
                    .setStyle("SECONDARY")
                    .setCustomId("imgNext")
                );

            return interaction.update({
                embeds: [Embed],
                components: [Button]
            })

        } else {
            return interaction.reply({
                content: "No more results found.",
                ephemeral: true
            });
        }
    }
}