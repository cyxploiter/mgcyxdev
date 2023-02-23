// Importing modules
const {
    glob
} = require("glob");
const {
    promisify
} = require("util");
const globPromise = promisify(glob);
const Discord = require('discord.js'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    util = require('util'),
    config = require('./config.json'),
    readdir = util.promisify(fs.readdir),
    client = new Discord.Client({
        intents: 32767,
        partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER'],
    });


var express = require("express");
var app = express();

app.get('/', function (req, res) {
    res.send('hello world');
});

// Only works on 3000 regardless of what I set environment port to or how I set [value] in app.set('port', [value]).
app.listen(8000);

module.exports = client;
// Adding to the client
client.event = new Discord.Collection();
client.commands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.config = config;
client.Database = require('./Database/Mongoose.js');
client.tools = require('./Tools/Tools.js');
client.logger = require('./Tools/Logger.js');
client.embed = require('./Tools/Embed.js');
client.snipes = new Discord.Collection();





async function init() {
    // Load Discordjs Events
    // const eventFiles = fs.readdirSync('./Events/').filter(file => file.endsWith('.js'));
    // for (const file of eventFiles) {
    //     const event = require(`./Events/${file}`);
    //     const eventName = file.split(".")[0];
    //     console.log(`Loading... ${eventName}`)
    //     client.on(eventName, event.bind(null, client));
    // }
    const eventFiles = await globPromise(`${process.cwd()}/Events/*/*.js`);
    eventFiles.map((value) => require(value));

    // Load Buttons

    const buttonFolders = fs.readdirSync('./Buttons/');

    buttonFolders.forEach(direct => {
        const buttonFiles = fs.readdirSync(`./Buttons/`).filter(file => file.endsWith('.js'));
        for (const file of buttonFiles) {
            const Button = require(`./Buttons/${file}`);
            client.buttons.set(Button.customId, Button);
        }
    })



    //Load the commands
    let folders = await readdir("./Commands/");
    folders.forEach(direct => {
        const commandFiles = fs.readdirSync('./Commands/' + direct + "/").filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./Commands/${direct}/${file}`);
            client.commands.set(command.name, command);
        }
    })

    // Connect to the database
    mongoose.connect(config.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Connected to MongoDB')
    }).catch((err) => {
        console.log('Unable to connect to MongoDB Database.\nError: ' + err)
    })

    await client.login(config.token)
}

init();

process.on('unhandledRejection', err => {
    console.log('Unknown error occured:\n')
    console.log(err)
})