const Discord = require('discord.js');
const translate = require('google-translate-api');
const isoConv = require('iso-language-converter');
const badwords = require('badwords/array');
const config = require('./config.json');
const bot = new Discord.Client();
const requiredChannels = ['welcome', 'member-log', 'terone-log', 'server-log'];
const greetings = ['Hi!', 'Hey there!', 'Hello'];
const triggerSubstring = ['hi', ' hii', 'wassup', 'yo', 'howdy', 'hola', 'heya', 'hey', 'hello', 'sup', 'morning'];
const green = 0x42f474, red = 0xf44542, blue = 3447003, yellow = 0xffeb3b, grey = 0x747F8D;
let args, command;


bot.on('ready', () => {
    bot.user.setPresence({ game: { name: `on ${bot.guilds.size} servers`, type: 0 } });
});
//
// Create required channels
//
bot.on('guildCreate', guild => {
    for (let i in requiredChannels) {
        if (!guild.channels.exists('name', requiredChannels[i])) {
            guild.createChannel(requiredChannels[i], 'text');
        }
    }
});


bot.on('message', message => {

    // If the user is a bot itself, don't do anything in order to prevet unwanted loops
    if (message.author.bot) return;


    let url = message.content.match(/\bwww\.\S+/gi);
    if (url) {
        message.channel.send(`Looks like you made a typo in the URL ${message.author}. No issues, here's the corrected message: http://${url}`);
    }

    // Only run if bot is mentioned
    if (message.isMentioned(bot.user)) {
        separateCommands(message);

        //
        // General greetings //
        //

        // Convert to lowercase in order to deal with all variations of spellings
        let _message = message.content.toLowerCase();
        // Prevent greetings if any command is given (eg. +translate hello fr would not make the bot say hello along with the result)
        if (_message.indexOf('+') == -1) {
            for (let i in triggerSubstring) {
                // Check the whole sentence for greetings instead of just the trigger command
                if (_message.indexOf(triggerSubstring[i]) !== -1) {
                    let index = Math.floor(Math.random() * greetings.length);
                    message.channel.send(`${greetings[index]} ${message.author}`);
                    break;
                }
            }

            //
            // Don't use profanity with mentions
            //
            for (let i in badwords) {
                if (_message.indexOf(badwords[i]) !== -1) {
                    message.delete();
                    message.channel.send({
                        embed: {
                            color: red,
                            description: `No profanity ${message.author}!`,
                            thumbnail: {
                                url: message.author.avatarURL
                            },
                            author: {
                                name: 'PROFANITY DETECTED'
                            }
                        }
                    });
                    break;
                }
            }

        }

        if (command == 'purge') purge(message);

        if (command == 'translate') translator(message);

        if (command == 'kick') kick(message);

        if (command == 'say') say(message);

        if (command == 'createchannel') createChannel(message);

        if (command == 'delrole') deleteRole(message);
    }
});


//
// Greet users when they come online or go offline and member-log
//
bot.on('presenceUpdate', (oldMember, newMember) => {
    if (oldMember.presence.status !== newMember.presence.status) {
        if (newMember.presence.status == 'online') {
            let index = Math.floor(Math.random() * 3);
            // So that each instance sends message to its own server instead of every server
            try {
                newMember.guild.channels.find('name', 'general').send(`${greetings[index]} ${newMember.user}. Welcome back :raising_hand:`);
            }
            catch (e) {
                console.log(e);
            }
        }
        const colors = {
            online: green,
            offline: grey,
            idle: yellow,
            dnd: red
        }
        let color = colors[newMember.presence.status];
        try {
            newMember.guild.channels.find('name', 'member-log').send({
                embed: {
                    color: color,
                    description: `**${newMember.user.username}** is now ${newMember.presence.status}`,
                    thumbnail: {
                        url: newMember.user.avatarURL
                    },
                    author: {
                        name: `MEMBER ${newMember.presence.status.toUpperCase()}`
                    }
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
});

//
// Server greeting
//
bot.on('guildMemberAdd', member => {
    let _member = member;
    try {
        _member.guild.channels.find('name', 'welcome').send({
            embed: {
                color: 3447003,
                description: `**Welcome** ${_member.user}! You are the ${_member.guild.memberCount + 1}th member!`,
                thumbnail: {
                    url: bot.user.avatarURL
                },
                author: {
                    name: 'Welcome'
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }

});

bot.login(config.token);


//
// Separate commands from arguments
//
function separateCommands(message, isClean) {
    // Store the content in a temp var
    let _message = message.content;
    // If a message with cleanContent is to be separated
    if (isClean) {
        _message = message;
    }
    // Split the message, remove the bot mention, rejoin and then remove the + prefix
    _message = _message.split(' ');
    _message.splice(0, 1);
    args = _message.join(' ').slice(1).trim().split(/ +/g);
    // Separate the command from the arguments
    command = args.shift().toLowerCase();

    console.log('command: ', command, 'args: ', args);
}


//
// Purge //
//
function purge(message) {
    // This command removes all messages from all users in the channel, up to 100.

    // Get the delete count
    const deleteCount = args[0];

    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply('Please provide a number between 2 and 100 for the number of messages to delete');

    // Get messages and delete them.
    message.channel.fetchMessages({ count: deleteCount })
        .then(messages => message.channel.bulkDelete(messages))
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));

}

//
// Translator
//
function translator(message) {

    let string = [];
    // Transfer the word(s) to another array
    for (let i = 0; i < args.length - 1; i++) {
        string[i] = args[i];
    }

    string = string.join(' ');

    // Capitalize first letter in order to be able to work with isoConv
    let lang = args[args.length - 1].toLowerCase().split('');
    lang[0] = lang[0].toUpperCase();
    lang = lang.join('');

    // Convert given language to appropriate ISO code
    let targetLang = isoConv(lang);

    // Compatiblity issue with isoConv and translation API
    targetLang = targetLang == 'zh' ? 'zh-cn' : targetLang;

    translate(string, { to: targetLang }).then(result => {
        if (result.from.text.autoCorrected) {
            message.channel.send(`The text was corrected to: ${result.from.text.value}`);
        }
        message.channel.send({
            embed: {
                color: 3447003,
                description: `**Translation from** __${isoConv(result.from.language.iso)}__:   ${result.text}`,
                thumbnail: {
                    url: 'http://res.cloudinary.com/daemonad/image/upload/v1504465478/Paomedia-Small-N-Flat-Globe_z01tid.png'
                },
                author: {
                    name: 'TRANSLATOR'
                }
            }
        });
    }).catch(err => {
        message.channel.send(`An error occured while attempting translate ${err}`);
    });
}

//
// Kick members
// Not yet functional
//
function kick(message) {
    let guild = message.guild;
    try {
        if (guild.member(message.author).roles.exists('name', 'mod')) {
            let _member = guild.member(args[0]);
            console.log(_member);

            /*message.channel.send({
                embed: {
                    color: 3447003,
                    description: `**${_member.user.username}** has been kicked by moderators`,
                    thumbnail: {
                        url: _member.user.avatarURL
                    },
                    author: {
                        name: 'MOD'
                    }
                }
            });*/
            message.channel.send(` ${_member.user} is _member.kickable`);
        }
        else {
            message.channel.send(`${message.author} You don't have required permissions for that`);
        }
    }
    catch (e) {
        console.log(e);
    }
}

//
// Say stuff
// Same logic as translator for separating message
//
function say(message) {
    let _message = [];
    for (let i = 0; i < args.length; i++) {
        _message[i] = args[i];
    }
    _message = _message.join(' ');
    message.channel.send({
        embed: {
            color: green,
            description: `${_message}`,
            thumbnail: {
                url: bot.user.avatarURL
            }
        }
    });
}

//
// Creates a channel
//
function createChannel(message) {
    let channelName = args[0];
    let channelType = args[1];
    try {
        if (!message.guild.channels.exists('name', channelName)) {
            if (channelType == 'text' || channelType == 'voice') {
                message.guild.createChannel(channelName, channelType)
                    .then(() => {
                        let creationTime = message.guild.channels.find('name', channelName).createdAt;
                        message.guild.channels.find('name', 'server-log').send({
                            embed: {
                                color: blue,
                                description: `Channel **${channelName}** created by ${message.author} at ${creationTime}`,
                                author: {
                                    name: 'CHANNEL CREATED'
                                }
                            }
                        })
                    });

            }
            else message.channel.send('**Please check if channel already exists and if you have entered valid channel type**: `text` or `voice`');
        }
    }
    catch (e) {
        console.log(e);
    }
}

//
// Deletes a given role
//
function deleteRole(message) {
    // Remove @mentions
    let _message = message.cleanContent;
    // Separate the commands from cleaed message    
    separateCommands(_message, true);
    // Remove the @
    let roleName = args[0].split('').splice(1).join('');
    let role = message.guild.roles.find('name', roleName);

    try {
        role.delete();
        message.guild.channels.find('name', 'server-log').send({
            embed: {
                color: red,
                description: `Role ${roleName} was deleted by ${message.author}`,
                author: {
                    name: 'ROLE DELETED'
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}