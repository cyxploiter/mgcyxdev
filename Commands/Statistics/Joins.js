const Discord = require('discord.js');
const {
    CanvasRenderService
} = require('chartjs-node-canvas');

const width = 1200;
const height = 400;
const chartCallback = (ChartJS) => {

    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;

    ChartJS.plugins.register({});
    ChartJS.controllers.MyType = ChartJS.DatasetController.extend({});
};
const canvasRenderService = new CanvasRenderService(width, height, chartCallback);
// White color and bold font
const ticksOptions = [{
    ticks: {
        fontColor: "white",
        fontStyle: "bold",
        fontSize: "12"
    }
}];
const options = {
    // Hide legend
    legend: {
        display: false
    },
    scales: {
        yAxes: ticksOptions,
        xAxes: ticksOptions
    }
};

module.exports = {
    name: "joins",
    usage: ["See the dates at which the most amount of users have joined your server```{prefix}invites <days>```"],
    enabled: true,
    hidden: false,
    aliases: [],
    category: "Statistics",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 5000,

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {
            let days = isNaN(Number(args[0])) ? 30 : Number(args[0]);
            let times = await fetchTimes(message.guild, days);
            if (times === false) return message.reply("No members have joined your server within this time frame")

            let lastXDays = await times.map(x => x.date)
            let amountJoined = await times.map(x => x.amount)
            var userAmount = 0;
            for (let i = 0; i < amountJoined.length; i++) {
                userAmount += amountJoined[i]
            }
            let color = "WHITE"
            const image = await canvasRenderService.renderToBuffer({
                type: "line",
                data: {
                    labels: lastXDays,
                    datasets: [{
                        data: amountJoined,
                        borderColor: `${color}`,
                        fill: true,
                        backgroundColor: `${color}80`
                    }],
                },
                options
            });

            const attachment = new Discord.MessageAttachment(image, "joins.gif");
            let embed = new Discord.MessageEmbed()
                .setAuthor({
                    name: `${message.guild.name} Joins Stats`,
                    iconURL: message.guild.iconURL({
                        dynamic: true
                    })
                })
                .setDescription(`In the past ${days} days ${userAmount} users have joined this server`)
                .setImage('attachment://joins.gif')
                .setColor("WHITE");
            return message.reply({
                embeds: [embed],
                files: [attachment]
            })
            async function fetchTimes(guild, days) {
                let limit = Date.now() - (days * 86400000);
                let memberTimes = await guild.members.cache.filter(x => x.user.bot !== true).map(x => x.joinedTimestamp).filter(x => x > limit).filter(x => x);
                await memberTimes.sort((a, b) => a - b)
                if (memberTimes.length < 1) return false;
                let date = new Date()
                let data = {}
                for (let i = 0; i < memberTimes.length; i++) {
                    let joinedDate = new Date(memberTimes[i]);
                    let verify = await checkDate(date, joinedDate);
                    if (verify.check) {
                        if (!data[verify.secondDate]) {
                            data[verify.secondDate] = {
                                date: verify.secondDate,
                                amount: 1
                            }
                            date = joinedDate;
                        } else {
                            data[verify.secondDate].amount++
                            date = joinedDate;
                        }
                    } else {
                        date = joinedDate;
                        if (!data[verify.secondDate]) {
                            data[verify.secondDate] = {
                                date: verify.secondDate,
                                amount: 1
                            }
                        } else {
                            data[verify.secondDate].amount++
                            date = joinedDate;
                        }
                    }
                }


                let arrData = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        let newData = {
                            date: data[key].date,
                            amount: data[key].amount
                        }
                        arrData.push(newData)
                    }
                }

                return arrData;
            }

            async function checkDate(firstDate, secondDate) {
                let first = `${firstDate.getDate()}-${firstDate.getMonth()+1}-${firstDate.getFullYear()}`;
                let second = `${secondDate.getDate()}-${secondDate.getMonth()+1}-${secondDate.getFullYear()}`;
                let check = first === second;
                let checkedData = {
                    check: check,
                    firstDate: first,
                    secondDate: second
                }
                return checkedData;
            }

        } catch (err) {
            client.logger.error(`Ran into an error while executing ${data.cmd.name}`)
            console.log(err)
            return client.embed.send(message, {
                description: `An issue has occured while running the command. If this error keeps occuring please contact our development team.`,
                color: `RED`,
                author: {
                    name: `Uh Oh!`,
                    icon_url: `${message.author.displayAvatarURL()}`,
                    url: "",
                }
            });
        }
    }
}
