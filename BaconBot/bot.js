//inv link https://discordapp.com/oauth2/authorize?&client_id=726142796448268301&scope=bot&permissions=8
var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var sys = require('sys');
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
                message.channel.send('Communist mode activated.');
                break;
            case 'spicy':
                message.channel.send('Mikey bot bot');
                break;
            case 'help':
                if (message.guild.owner.id == message.author.id || message.member.roles.cache.find(role => role.name === servers[message.guild.id]["admin"])) {
                    message.channel.send("*It is obviously very important that you spell all roles and text channels correctly*");
                    message.channel.send('"+new role-name" to assign that role to all incoming members');
                    message.channel.send('');
                }
                break;
            case 'max is dumb':
                break;
            case 'admin':
                if (message.guild.owner.id == message.author.id || message.member.roles.some(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        var temp = args[1];
                        for (var i = 2; i < args.length; i++) {
                            temp += " " + args[i]
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
                if (message.guild.owner.id == message.author.id || message.member.roles.cache.find(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        var temp = args[1];
                        for (var i = 2; i < args.length; i++) {
                            temp += " " + args[i]
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
                if (message.guild.owner.id == message.author.id || message.member.cache.find(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        var temp = args[1];
                        for (var i = 2; i < args.length; i++) {
                            temp += " " + args[i]
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
                } else if (message.guild.owner.id == message.author.id || message.member.roles.cache.find(role => role.name === servers[message.guild.id]["admin"])) {
                    message.channel.send('Hello!');

                }
                break;
            case 'rules':
                if (message.guild.owner.id == message.author.id || message.member.roles.some(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        var temp = args[1]
                        for (var i = 2; i < args.length; i++) {
                            temp += " " + args[i]
                        }
                        servers[message.guild.id]["rules"] = temp;

                    } else {

                    }
                }
                break;
            case 'interest':
                if (message.guild.owner.id == message.author.id || message.member.roles.cache.find(role => role.name === servers[message.guild.id]["admin"])) {
                    if (args[1]) {
                        if (args[1].toLowerCase() == "add" && args[2]) {
                            var interest = args[2];
                            for (var i = 3; i < args.length; i++) {
                                interest += " " + args[i];

                            }
                            var info = interest.split("   ")
                            if (info[2]) {
                                servers[message.guild.id]["interests"][info[0]] = [info[1], info[2].replace(/\s/g, '')];
                                message.channel.send("Interest Saved!");
                            }
                            else {
                                message.channel.send("Please make sure you format it correctly");
                            }


                        }
                        if (args[1].toLowerCase() == "remove" && args[2]) {
                            var temp = args[2];
                            for (var i = 3; i < args.length; i++) {
                                temp += " " + args[i];
                            }
                            if (servers[message.guild.id]["interests"].hasOwnProperty(temp)) {
                                delete servers[message.guild.id]["interests"][temp];
                            } else {
                                message.channel.send("couldn't find an interst with that name");
                            }
                        }
                        if (args[1].toLowerCase() == "server" && args[2]) {
                            var temp = args[2];
                            for (var i = 3; i < args.length; i++) {
                                temp += " " + args[i];
                            }
                            servers[message.guild.id]["self-roles"] = temp;

                        }
                        saveData();
                        updateSelfRoles(message);
                    } else {
                        message.channel.send('Usage: "+interest add/remove Interest-name   role to assign   emoji to react". seperate each after the name with three spaces. use add to change existing interests. With remove you only need to specify the name.')

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


    if (reaction.message.channel.name == servers[reaction.message.guild.id]["rules"]) {
        const role = user.guild.roles.cache.find(role => role.name === servers[reaction.message.guild.id]["Members"]);
        const role1 = user.guild.roles.cache.find(role => role.name === servers[reaction.message.guild.id]["New Members"]);
        user.roles.add(role);
        user.roles.remove(role1);
    }
    if (reaction.message.channel.name.toLowerCase() === servers[reaction.message.guild.id]["self-roles"]) {
        console.log("Activated");
        var arr = Object.keys(servers[reaction.message.guild.id]["interests"]);
        for (var i = 0; i < arr.length; i++) {
            if (reaction.emoji.name == servers[reaction.message.guild.id]["interests"][arr[i]][1]) {
                console.log(servers[reaction.message.guild.id]["interests"][arr[i]][0]);
                console.log("found emoji");
                const role = reaction.message.guild.roles.cache.find(role => role.name === servers[reaction.message.guild.id]["interests"][arr[i]][0]);
                const memberWhoReacted = reaction.message.guild.members.cache.find(member => member.id === user.id);
                memberWhoReacted.roles.add(role);
            }
        }

    }
});
client.on("guildMemberAdd", (member) => {
    if (servers[member.guild.id]["New Members"] != "") {
        console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);
        const role = member.guild.roles.cache.find(role => role.name === servers[member.guild.id]["New Members"]);
        member.roles.add(role);
        member.send("Hello and welcome to " + member.guild.name + "!");
        if (servers[member.guild.id]["self-roles"]) {
            member.send("Feel free to navigate to the #self-roles text channel to let us know what you're intrested in!");
        }
    }
});
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    if (servers[guild.id]) { } else {
        servers[guild.id] = {
            "serverID": "", "New Members": "", "Members": "", "admin": "", "rules": "rules", "self-roles": "self-roles",
            "interest": {}
        };
    }
    console.log(servers);
    saveData()
    // { "serverID": "", "New Members": "", "Members": "", "admin": "", "rules": "rules" }
    // Your other stuff like adding to guildArray
})

function saveData() {
    var json = JSON.stringify(servers);
    fs.writeFile('./database.json', json, 'utf8', (err) => {
        if (err) { console.error(err); return; };
    });

}
function updateSelfRoles(m) {
    if (m.guild.channels.cache.find(c => c.name.toLowerCase() === servers[m.guild.id]["self-roles"]) && !(Object.keys(servers[m.guild.id]["interests"]).length === 0)) {
        m.guild.channels.cache.find(c => c.name.toLowerCase() === servers[m.guild.id]["self-roles"]).messages.fetch()
            .then(messages => {
                var messageExists;
                messages.filter(msg => {
                    console.log(msg.author.bot + " " + msg.channel.name);
                    if (msg.author.bot && msg.channel.name === servers[m.guild.id]["self-roles"]) {
                        messageExists = msg;
                    }
                });
                var rolesChannel = m.guild.channels.cache.find(c => c.name.toLowerCase() === servers[m.guild.id]["self-roles"]);
                if (!(messageExists)) {
                    for (var i in servers[m.guild.id]["interests"]) {
                        rolesChannel.send(i);
                    }
                } else {
                    var arr = Object.keys(servers[m.guild.id]["interests"]);
                    var edited = "`**React to this message to show your interests**`\n\n" + "`" + servers[m.guild.id]["interests"][arr[0]][1] + ": " + arr[0] + "`";
                    messageExists.react(servers[m.guild.id]["interests"][arr[0]][1]);
                    for (var i = 1; i < arr.length; i++) {
                        edited += "\n\n" + "`" + servers[m.guild.id]["interests"][arr[i]][1] + ": " + arr[i] + "`";
                        messageExists.react(servers[m.guild.id]["interests"][arr[i]][1]);
                        console.log(servers[m.guild.id]["interests"][arr[i]][1]);

                    }
                    console.log(edited);
                    messageExists.edit(edited);
                }
            });
    } else {
        console.log("no intersts or self-roles")
    }
}

































































































































































