// const Discord = require("discord.js");
// const DB = require("../../Database/Schema/ReactionRoles")
// module.exports = {
//     name: "assign",
//     usage: ["Assign role to a member", "```{prefix}ass <@mention>```"],
//     enabled: true,
//     aliases: ["ass"],
//     category: "Admin",
//     memberPermissions: ["ADMINISTRATOR"],
//     botPermissions: ["MANAGE_ROLES", "SEND_MESSAGES", "EMBED_LINKS"],
//     //Settings for command
//     nsfw: false,
//     ownerOnly: false,
//     cooldown: 5000,

//     /**
//      * @param {Discord.Client} client
//      * @param {Discord.Message} message
//      * @param {String[]} args
//      */

//     // Execute contains content for the command
//     async execute(client, message, args, data) {
//         try {

//         } catch (err) {
//             client.logger.error(`Ran into an error while executing ${data.cmd.name}`)
//             console.log(err)
//             return client.embed.send(message, {
//                 description: `An issue has occured while running the command. If this error keeps occuring please contact our development team.`,
//                 color: `RED`,
//                 author: {
//                     name: `Uh Oh!`,
//                     icon_url: `${message.author.displayAvatarURL()}`,
//                     url: "",
//                 }
//             });
//         }
//     }
// }