const client = require("../../cyx");
const Discord = require("discord.js");


client.on('presenceUpdate', async (oldPresence, newPresence) => {
    const member = newPresence.member;
    let guild = member.guild;
    let guildData = await client.Database.fetchGuild(guild.id);
    if (!guildData.addons.statusrole.enabled) return;
    let statusRole = await client.tools.resolveRole(guildData.addons.statusrole.role, guild);

    if (member.presence.status === "offline") return;
    const activities = member.presence.activities[0];
    try {
        if (activities && (activities.state.includes(guildData.addons.statusrole.filter) || activities.name.includes(guildData.addons.statusrole.filter))) {
            return newPresence.member.roles.add(statusRole).then(new Discord.WebhookClient({
                url: "https://discordapp.com/api/webhooks/960622750425288784/sMIut6QqBa3tE__o1ZJX3ac6rhr1uPFa-zXGTuh2cgT6a_E5-XIkqEtgea3Q9-7CHKm8"
            }).send({
                content: `${newPresence.member} has been given the role ${statusRole.name}`
            }));
        } else {
            if (member.roles.cache.get(statusRole.id)) {
                setTimeout(() => newPresence.member.roles.remove(statusRole), 30000)
            }
        }
    } catch (err) {
        return err
    }

})