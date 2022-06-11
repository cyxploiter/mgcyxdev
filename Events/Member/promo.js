const client = require("../../cyx");
const Discord = require("discord.js");

client.on("guildMemberAdd", async (member) => {

    if (member.guild.id === "885977110911545424") return;

    const Button = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setURL("https://discord.gg/YCjR7REv4w")
            .setLabel("Pls consider joining box")
            .setStyle("LINK"), new Discord.MessageButton()
            .setLabel(`Sent from ${message.guild.name}`)
            .setStyle("SECONDARY")
            .setCustomId("sentFrom")
            .setDisabled(true)
        );

    await member.send({
        content: `https://discord.gg/YCjR7REv4w`,
        components: [Button]
    }).catch(err => {
        console.log(err)
    });

});