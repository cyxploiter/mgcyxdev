const client = require("../cyx")

module.exports = async (client) => {

    console.log('Bot is ready to roll out')
    client.user.setPresence({
        activity: {
            name: 'for .help',
            type: "WATCHING"
        },
        status: "online"
    });
}