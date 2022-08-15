const client = require("../../cyx");
const Discord = require("discord.js");
const TikTokScraper = require('tiktok-scraper');

client.on("messageCreate", async (message) => {
    if (message.guild.id != "1008658326080475176") return;
    if (message.author.bot) return;

    const videoMeta = await TikTokScraper.getVideoMeta(message.content);
    const viduri = videoMeta.collector[0].videoUrl;

    await message.channel.send({
        files: [{
            attachment: viduri,
            name: 'vid.mp4'
        }]
    });
});