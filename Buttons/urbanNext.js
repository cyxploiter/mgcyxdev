// const Discord = require('discord.js');
// const resultMap = require('../Maps/urbanResMap');

// module.exports = {
//     label: 'Next',
//     customId: 'urbanNext',

//     /**
//      * @param {Discord.Client} client
//      * @param {Discord.Interaction} interaction
//      * @param {Discord.Message} message
//      */

//     async execute(interaction, client, message) {
//         const searchResult = await resultMap.get(message.id);

//         const msg = await message.channel.messages.fetch(message.id);

//         if (!searchResult) return interaction.reply({
//             content: `No results were found. Try searching again.`,
//             ephemeral: true
//         });
//         const id = msg.embeds[0].footer.text.split(' ')[1];
//         console.log(id);
//         const searchResultSize = searchResult.size;
//         const searchResultIndexId = (() => {
//             if (parseInt(id) === 1) return 1;
//             else {
//                 return parseInt(id);
//             }

//         })();
//         console.log(searchResultIndexId);
//         const searchResultIndex = searchResultIndexId;
//         const searchResultIndexNext = searchResultIndex + 1;
//         const searchResultIndexNextCheck = searchResultIndexNext < searchResultSize;
//         let entry = searchResult.get(searchResultIndexNext);
//         console.log(entry);
//         if (searchResultIndexNextCheck) {

//             let Embed = new Discord.MessageEmbed()
//                 .setTitle(`${entry.word} Urban Dictionary`)
//                 .setColor(`WHITE`)
//                 .setURL(`${entry.permalink}`)
//                 .setDescription(`**${entry.word}**\n\n${entry.definition}`)
//                 .addFields({
//                     name: `Example`,
//                     value: `${entry.example}`
//                 }, {
//                     name: `Author`,
//                     value: `${entry.author}`
//                 }, {
//                     name: `Rating`,
//                     value: `${entry.thumbs_up} :thumbsup: | ${entry.thumbs_down} :thumbsdown:`
//                 })
//                 .setFooter({
//                     text: `Page ${searchResultIndexNext + 1} of ${searchResultSize}`
//                 });

//             const Button = new Discord.MessageActionRow()
//                 .addComponents(
//                     new Discord.MessageButton()
//                     .setLabel("Previous")
//                     .setEmoji("⏪")
//                     .setStyle("SECONDARY")
//                     .setCustomId("imgPrev"),

//                     new Discord.MessageButton()
//                     .setLabel("Next")
//                     .setEmoji("⏩")
//                     .setStyle("SECONDARY")
//                     .setCustomId("imgNext")
//                 );
//             !interaction.deferred && await interaction.deferUpdate();
//             return interaction.editReply({
//                 embeds: [Embed],
//                 components: [Button]
//             })

//         } else {
//             return interaction.reply({
//                 content: "No more results found.",
//                 ephemeral: true
//             });
//         }
//     }
// }