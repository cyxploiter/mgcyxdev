const Discord = require('discord.js');
const TicTacToe = require('discord-tictactoe');
const game = new TicTacToe({
    language: "en"
});

module.exports = {
    name: "tictactoe",
    usage: ["Play a game of tic tac toe with the mentioned user. The game will be played in the channel the command is used in. ```{prefix}tictactoe @user```"],
    enabled: true,
    hidden: false,
    aliases: ["ttt"],
    category: "Fun",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 100000,

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */


    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {

            if (!message.mentions.users.size) {
                return client.embed.send(message, {
                    description: `You need to mention a user to play a game of tic tac toe with.`,
                    color: `RED`,
                })
            };

            if (message.mentions.users.size > 1) {
                return client.embed.send(message, {
                    description: `You can only play a game of tic tac toe with one user at a time.`,
                    color: `RED`,
                })
            }

            if (message.mentions.users.first().id === message.author.id) {
                return client.embed.send(message, {
                    description: `You can't play a game of tic tac toe with yourself.`,
                    color: `RED`,
                })
            }

            if (message.mentions.users.first().bot) {
                return client.embed.send(message, {
                    description: `You can't play a game of tic tac toe with a bot.`,
                    color: `RED`,
                })
            }

            game.handleMessage(message);

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