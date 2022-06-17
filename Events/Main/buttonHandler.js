const client = require("../../cyx");
const Discord = require("discord.js");
const fs = require("fs");


client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        const Button = client.buttons.get(interaction.customId);
        if (!Button) return;

        if (Button.permissions && !interaction.member.permissions.has(Button.permissions))
            return interaction.reply({
                content: "You do not have the required permissions to use this button.",
                ephemeral: true
            });

        if (Button.ownerOnly && interaction.member.id !== client.config.ownerID && interaction.member.id !== interaction.guild.ownerId)
            return interaction.reply({
                content: "You do not have the required permissions to use this button.",
                ephemeral: true
            });

        return Button.execute(interaction, client, interaction.message);
    }
});