const client = require("../../cyx");

client.on("guildMemberAdd", async (member) => {
    if (member.user.bot) return;
    if (member.guild.id === "885977110911545424") {
        let guild = member.guild;
        let guildData = await client.Database.fetchGuild(guild.id); // Get guild document from database
        if (!guildData.addons.welcome.enabled) return; // Welcome messages aren't enabled

        let welcomeChannel = await client.tools.resolveChannel(guildData.addons.welcome.channel, guild); // Try find the welcome channel
        if (!welcomeChannel) return; // Unable to find channel in guild

        let welcomeMsg = (guildData.addons.welcome.message === null || guildData.addons.welcome.message === "" || guildData.addons.welcome.message === " ") ? "Welcome! {user.ping}" : guildData.addons.welcome.message; // Get the custom message or use the preset one

        // Replace all valid tags
        let finalMsg = await welcomeMsg
            .replace(/{user.ping}/g, `${member.user}`)
            .replace(/{user.name}/g, `${member.user.username}`)
            .replace(/{user.id}/g, `${member.user.id}`)
            .replace(/{user.tag}/g, `${member.user.tag}`)
            .replace(/{guild.name}/g, `${guild.name}`)
            .replace(/{guild.id}/g, `${guild.id}`)
            .replace(/{guild.totalUser}/g, `${guild.memberCount}`);

        welcomeChannel.send(finalMsg) // Send the final message to the welcome channel
        return member.roles.add("938346436158959666");
    };
});