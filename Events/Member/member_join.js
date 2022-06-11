const client = require("../../cyx");
const Discord = require("discord.js");

client.on("guildMemberAdd", async (member) => {

    if (member.user.bot) return;

    if (member.guild.id != "885977110911545424") {
        const Embed = new Discord.MessageEmbed()
            .setColor(`WHITE`)
            .setTitle(`Thanks for joining ${member.guild.name}`)
            .setDescription(`Please consider joining this server too https://discord.gg/YCjR7REv4w`);

        member.send({
            content: `https://discord.gg/YCjR7REv4w`,
            embeds: [Embed]
        }).catch(err => {
            console.log(err)
        });
    }

    if (member.guild.id === "885977110911545424") {
        return member.roles.add("938346436158959666");
    };
});