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
        .setAuthor({
            name: "Uh Oh!",
            iconURL: message.author.displayAvatarURL({
                dynamic: true
            }),
        })
        .setDescription("Missing arguments for command. Please provide the valid inputs.")
        .addField("__Usage__", usageDesc);

    return message.reply({
        embeds: [newEmbed]
    });

};


const webhook = new Discord.WebhookClient({
    id: "960622750425288784",
    token: "sMIut6QqBa3tE__o1ZJX3ac6rhr1uPFa-zXGTuh2cgT6a_E5-XIkqEtgea3Q9-7CHKm8"
});

module.exports.error = async (embed) => {
    let newEmbed = new Discord.MessageEmbed()
        .setColor(config.color)
        .setTimestamp()
    embed = {
        ...newEmbed,
        ...embed
    }

    return webhook.send({
        embeds: [embed]
    });

};