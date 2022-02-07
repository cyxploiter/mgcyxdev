const client = require("../../cyx");

client.on('messageDelete', async (message) => {
    let snipes = client.snipes.get(message.channel.id) || [];
    if (snipes.length > 5) snipes.slice(0, 4);

    snipes.unshift({
        msg: message,
        image: message.attachments.first()?.proxyURL || null,
        time: new Date(message.createdTimestamp).toLocaleTimeString()
    })

    client.snipes.set(message.channel.id, snipes);
});