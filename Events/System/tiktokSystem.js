const client = require("../index");
const {
    MessageAttachment,
    MessageEmbed
} = require("discord.js");
const TikTokScraper = require('tiktok-scraper');

client.on("messageCreate", async (message) => {


    const videoMeta = await TikTokScraper.getVideoMeta(message.content);
    const viduri = videoMeta.collector[0].videoUrl;

    await message.channel.send({
        files: [{
            attachment: viduri,
            name: 'vid.mp4'
        }]
    });
});