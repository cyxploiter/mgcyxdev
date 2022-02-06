const client = require("../../cyx")

client.on("ready", async () => {
    console.log(`${client.user.tag} is up and ready to go!`)
    client.user.setPresence({
        activities: [{
            name: "Cyx's leaked 18+ tape",
            type: "WATCHING",
            url: "https://discord.gg/dys/",
            buttons: "Join Us?"
        }],
        status: "idle"
    });
})