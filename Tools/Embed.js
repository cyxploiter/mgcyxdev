const Discord = require("discord.js"),
    config = require('./../config.json');

module.exports.send = async (message, embed) => {
    let newEmbed = new Discord.MessageEmbed()
        .setColor(config.color)
    embed = {
        ...newEmbed,
        ...embed
    }

    return message.reply({
        embeds: [embed]
    });

};

module.exports.usage = async (message, data) => {
    let cmd = data.cmd;
    let usageDesc = await cmd.usage.join("\n").replace(/{prefix}/g, data.guild.prefix);

    let newEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor("Uh Oh!", message.author.displayAvatarURL())
        .setDescription("Missing arguments for command. Please provide the valid inputs.")
        .addField("__Usage__", usageDesc);

    return message.reply({
        embeds: [newEmbed]
    });

};