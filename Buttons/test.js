const Discord = require('discord.js');

module.exports = {
    label: 'Test',
    customId: 'test',
    permission: 'ADMINISTRATOR',

    /**
     * @param {Discord.Client} client
     * @param {Discord.Interaction} interaction
     * @param {Discord.Message} message
     */

    async execute(interaction, client, message) {

        message.edit({
            content: 'Monke',
            components: []
        }).then(() => {
            message.suppressEmbeds(true);
        }).catch(console.error);

    }
}