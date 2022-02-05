const client = require("../../cyx")

client.on("ready", () => {
    console.log(`${client.user.tag} is up and ready to go!`)
    client.user.setPresence({
        activity: {
            name: 'for ,help',
            type: "WATCHING",
        },
        status: "online"
    });
})