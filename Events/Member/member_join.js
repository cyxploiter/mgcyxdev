const client = require("../../cyx");
const Discord = require("discord.js");

client.on("guildMemberAdd", async (member) => {

    if (member.user.bot) return;

    if (member.guild.id != "885977110911545424") {

        message.author.send({
            content: `https://discord.gg/YCjR7REv4w`,
            components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton().setURL("https://discord.gg/YCjR7REv4w").setLabel("Pls consider joining box").setStyle("LINK"), new Discord.MessageButton().setLabel(`Sent from ${message.guild.name}`).setStyle("SECONDARY").setCustomId("sentFrom").setDisabled(true))]
        }).catch(err => {
            console.log(err)
        });
    }

    if (member.guild.id === "885977110911545424") {
        return member.roles.add("938346436158959666");
    };
});