//inv link https://discordapp.com/oauth2/authorize?&client_id=726142796448268301&scope=bot&permissions=8
var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var database = require('./database.json');
var fs = require('fs');
const { Console } = require('winston/lib/winston/transports');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
var servers = {};
fs.readFile('./database.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log("couldn't get data" + err);
    } else {
        servers = JSON.parse(data);
        console.log(servers);
    }
});
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot

client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
    //client.channels.cache.get('general').send("Unfortunalty I went down... But I'm back now!");



});
client.login(auth.token);
client.on('message', message => {

    if (message.content.substring(0, 1) == '+') {

        var args = message.content.substring(1).split(' ');
        // var cmd = args[0];
        var lower = args[0].toLowerCase()
        // args = args.splice(1);
        // for (var i = 0; i < args.length; i++) {
        switch (lower) {

            case 'ping':
                message.channel.send('Pong!');
                break;
            case 'upupdowndownleftrightleftrightabstart':
                message.channel.send('bot bot');
                break;
            case 'spicy':
                message.channel.send('Mikey bot bot');
                break;
            case 'help':
                if (message.guild.owner.id == message.author.id || message.member.roles.some(role => role.name === servers[message.guild.id]["admin"])) {
                    message.channel.send('"+new role-name" to assign that role to all incoming members');
                    message.channel.send('');
                }
                break;
            case 'admin':
                if (message.guild.owner.id == message.author.id || message.member.roles.some(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        var temp = ""
                        for (var i = 1; i < args.length; i++) {
                            temp += args[i]
                        }
                        servers[message.guild.id]["admin"] = temp;
                        message.channel.send("The role " + '"' + temp + '"' + " can now control me");
                        saveData();
                    }
                    else {
                        message.channel.send('Usage: "+admin role-name" to allow a role to manage me.');
                    }
                }
                break;
            case 'new':
                if (message.guild.owner.id == message.author.id || message.member.roles.some(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        var temp = ""
                        for (var i = 1; i < args.length; i++) {
                            temp += args[i]
                        }
                        servers[message.guild.id]["New Members"] = temp;
                        message.channel.send("I will add the role " + '"' + temp + '"' + " to all new members!");
                        saveData();
                    }
                    else {
                        message.channel.send('Usage: "+new role-name" to assign that role to all incoming members');
                    }
                }
                break;
            case 'member':
                if (message.guild.owner.id == message.author.id || message.member.roles.some(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        var temp = ""
                        for (var i = 1; i < args.length; i++) {
                            temp += args[i]
                        }

                        try {
                            const role = message.guild.roles.cache.find(role => role.name);

                        } catch (e) {
                            message.channel.send("no role exists called " + temp + " " + e);
                            break;
                        }
                        servers[message.guild.id]["Members"] = temp;
                        message.channel.send("After new members react to the rules they will be added to " + '"' + temp + '"' + "!");
                        saveData();
                    }
                    else {
                        message.channel.send('Usage: "+member role-name" to replace the new member role with this role');
                    }
                }
                break;
            case 'init':
                if (servers[message.guild.id]["admin"] == "") {
                    if (message.guild.owner.id == message.author.id) {
                        message.channel.send('Hello!');
                        if (servers[message.guild.id]["New Members"] == "") {
                            message.channel.send('Use "+new role-name" to assign specified role to new members');
                        }
                        if (servers[message.guild.id]["Members"] == "") {

                        }
                    }
                } else if (message.guild.owner.id == message.author.id || message.member.roles.some(role => role.name === servers[message.guild.id]["admin"])) {
                    message.channel.send('Hello!');

                }
                break;
            case 'rules':
                if (message.guild.owner.id == message.author.id || message.member.roles.some(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        var temp = ""
                        for (var i = 1; i < args.length; i++) {
                            temp += args[i]
                        }

                    } else {

                    }
                }
                break;

        }
        //}
    }
    // message.react('👍').then(() => message.react('👎'));

    // const filter = (reaction, user) => {
    //     return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
    // };

});

client.on('messageReactionAdd', async (reaction, user) => {

    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }
    console.log(reaction.message.channel.name);
    if (reaction.message.channel.name.toLowerCase() == "rules") {
        const role = user.guild.roles.cache.find(role => role.name === servers[message.guild.id]["Members"]);
        const role1 = user.guild.roles.cache.find(role => role.name === servers[message.guild.id]["New Members"]);
        user.roles.add(role);
        user.roles.remove(role1);
    }
    if (reaction.message.channel.name.toLowerCase() == "anti-rules") {

    }
});
client.on("guildMemberAdd", (member) => {
    if (servers[message.guild.id]["New Members"] != "") {
        console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);
        const role = member.guild.roles.cache.find(role => role.name === servers[message.guild.id]["New Members"]);
        member.roles.add(role);
    }
});
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    servers[guild.id] = { "serverID": "", "New Members": "", "Members": "", "admin": "", "rules": "rules" };
    console.log(servers);
    saveData()
    //{ "serverID": "", "New Members": "", "Members": "", "admin": "", "rules": "rules" }
    //Your other stuff like adding to guildArray
})

function saveData() {
    var json = JSON.stringify(servers);
    fs.writeFile('./database.json', json, 'utf8', (err) => {
        if (err) { console.error(err); return; };
    });

}

