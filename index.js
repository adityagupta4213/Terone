const Discord = require('discord.js');
const apiai = require('apiai');
const translate = require('google-translate-api');
const isoConv = require('iso-language-converter');
const justGetJSON = require('just-get-json');
const badwords = require('badwords/array');
const config = require('./config.json');
const help = require('./help.json');
const bot = new Discord.Client();
const app = apiai(config.apiaiToken);
const prefix = config.prefix;
const greetings = ['Hey there', 'Hi', 'Hello', 'Howdy'];
const requiredChannels = ['welcome', 'member-log', 'terone-log', 'server-log'];
const green = 0x42f474, red = 0xf44542, blue = 3447003, yellow = 0xffeb3b, grey = 0x747F8D;
let args, command, profanity = false;


//
// Server count as current game
//
bot.on('ready', () => {
    console.log('Online!');
    bot.user.setPresence({ game: { name: `on ${bot.guilds.size} servers`, type: 0 } });
});

function initialize(message) {
    if (!message.member.hasPermission(['MANAGE_CHANNELS']))
        return message.channel.send(`${message.author} You can't really do that can you? **You don't have the required permissions to manage channels!`);

    const guild = message.guild;
    let error, didInit = false;
    for (let i in requiredChannels) {

        if (!guild.channels.exists('name', requiredChannels[i])) {
            guild.createChannel(requiredChannels[i], 'text')
                .then(didInit = true)
                .catch((e) => { didInit = false; error = e });
        }
    }
    if (didInit)
        return message.reply(`Initialization complete!`);
    else
        return message.reply(`Couldn't initialize due to ${error.message}`);
}

bot.on('message', message => {
    // If the user is a bot itself, don't do anything in order to prevet unwanted loops
    if (message.author.bot) return;
    // Ignore anything that doesn't have the prefix or bot mentioned
    if (!message.isMentioned(bot.user) && message.content.indexOf(prefix) !== 0) return;


    //
    // HTTP auto prefixing
    //
    // If message has 'www.' 
    let url = message.content.match(/\bwww\.\S+/gi);
    if (url) {
        message.channel.send(`Looks like you made a typo in the URL ${message.author}. No issues, here are the corrected ones:`);
        for (let i in url) {
            message.channel.send(`http://${url[i]}`);
        }
    }


    // Separate command from args
    separateCommand(message);

    //
    // General greetings //
    //

    // Convert to lowercase in order to deal with all variations of spellings

    //
    // Check for vulgar comments
    //
    _message = message.content.toLowerCase();
    for (let i in badwords) {
        if (_message.search(badwords[i]) !== -1) {
            profanity = true;
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
        else
            profanity = false;
    }

    ////////// AI CONVERSATIONAL AGENT IS CURRENTLY UNDER TRAINING //////////
    if (message.content.indexOf(prefix) == -1 && !profanity) {
        // Remove the bot mention from the message
        let _message = message.content.split(' ').slice(1).join(' ');
        // Generate a random session ID
        let randomID = Math.floor(Math.random() * 9999);
        // Call the agent
        let request = app.textRequest(`${_message}`, { sessionId: randomID });

        request.on('response', function (response) {
            // Log all responses.
            console.log(response);
            // Set response text equal to the output speech. 
            let responseText = response.result.fulfillment.speech;
            // If response is not available, return default
            if (!responseText)
                message.reply(`I'm afraid I don't have a reply to that. I'm trying to get better every day though`);
            else
                message.reply(`${responseText}`);
        });

        request.on('error', function (error) {
            console.log(error);
        });


        request.end();
    }

    // Only run these commands if the bot is in a server. Not in a DM
    if (!message.guild && message.content.indexOf(prefix) !== -1)
        return message.channel.send({
            embed: {
                color: yellow,
                description: 'You need to [add me to a server](https://discordapp.com/oauth2/authorize?client_id=356369928426749952&scope=bot&permissions=1007119423) for any of my commands to work mate!',
            }
        });   
    if (command == 'init') initialize(message);

    if (command == 'kick') kick(message);

    if (command == 'ban') ban(message);

    if (command == 'createchannel') createChannel(message);

    if (command == 'delchannel') deleteChannel(message);

    if (command == 'createrole') _createRole(message);

    if (command == 'delrole') deleteRole(message);

    if (command == 'renrole') renameRole(message);

    if (command == 'warn') warnMember(message);

    if (command == 'bulkdm') bulkDM(message);

    if (command == 'help') _help(message);

    if (command == 'purge') purge(message);

    if (command == 'translate') translator(message);

    if (command == 'say') say(message);

    if (command == 'weather') findWeather(message);

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
                color: blue,
                description: `**Welcome** ${_member.user}! You are the ${_member.guild.memberCount + 1}th member!`,
                thumbnail: {
                    url: bot.user.avatarURL
                },
                author: {
                    name: 'WELCOME'
                }
            }
        });
        _member.guild.channels.find('name', 'member-log').send({
            embed: {
                color: blue,
                description: `${_member.user} has joined the server`,
                thumbnail: {
                    url: bot.user.avatarURL
                },
                author: {
                    name: 'MEMBER JOINED'
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }

});
bot.on('guildMemberRemove', member => {
    let _member = member;
    try {
        _member.guild.channels.find('name', 'member-log').send({
            embed: {
                color: red,
                description: `${_member.user} has left the server`,
                thumbnail: {
                    url: bot.user.avatarURL
                },
                author: {
                    name: 'MEMBER LEFT'
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }

});

//
// Server join log
//
bot.on('guildCreate', guild => {
    bot.channels.find('name', 'terone-log').send({
        embed: {
            color: 3447003,
            description: `Terone is now a member of **${guild.name}**`,
            thumbnail: {
                url: guild.iconURL
            },
            author: {
                name: 'SERVER JOINED'
            },
            fields: [
                {
                    "name": "Owner",
                    "value": `${guild.owner}`
                },
                {
                    "name": "Server Region",
                    "value": `${guild.region}`
                },
                {
                    "name": "Joined at",
                    "value": `${guild.joinedAt}`
                },
                {
                    "name": "Members",
                    "value": `${guild.memberCount}`
                }
            ]
        }
    });
});

//
// Server leave log
//
bot.on('guildDelete', guild => {
    bot.channels.find('name', 'terone-log').send({
        embed: {
            color: red,
            description: `Terone is no longer a member of **${guild.name}**`,
            thumbnail: {
                url: guild.iconURL
            },
            author: {
                name: 'SERVER LEFT'
            },
            fields: [
                {
                    "name": "Owner",
                    "value": `${guild.owner}`
                },
                {
                    "name": "Server Region",
                    "value": `${guild.region}`
                },
                {
                    "name": "Server ID",
                    "value": `${guild.id}`
                },
                {
                    "name": "Joined at",
                    "value": `${guild.joinedAt}`
                },
                {
                    "name": "Members",
                    "value": `${guild.memberCount}`
                }
            ]
        }
    });
});

bot.login(config.token);


//
// Separate commands from arguments
//
function separateCommand(message) {
    // Store the content in a temp var
    let _message = message.content;
    // Split the message and then remove the ++ prefix
    args = _message.slice(prefix.length).trim().split(/ +/g);
    // Separate the command from the arguments
    command = args.shift().toLowerCase();

    console.log('command: ', command, 'args: ', args);
}


//
// Purge //
//
function purge(message) {

    if (!message.member.hasPermission(['MANAGE_MESSAGES']))
        return message.channel.send(`${message.author} Don't try to remove evidence :D ! You don't have the permissions to manage messages`);
    // This command removes all messages from all users in the channel, up to 100.

    // Get the delete count + the command itself
    const deleteCount = args[0] + 1;

    if (!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply('Please provide a number between 2 and 100 for the number of messages to delete');

    // Get messages and delete them
    message.channel.fetchMessages({ limit: deleteCount })
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
//
function kick(message) {
    if (!message.member.hasPermission(['KICK_MEMBERS']))
        return message.reply(`Sorry, you don't have permissions to use this!`);

    // Check if member exsits and is kicable 
    let member = message.mentions.members.first();
    let reason = args[1];
    if (!reason)
        reason = 'No specified reason';
    if (!member)
        return message.reply('Please mention a valid member of this server');
    if (!member.kickable)
        return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');

    member.kick(reason)
        .then(() => {
            message.channel.send({
                embed: {
                    color: red,
                    description: `**${member.user.username}** has been kicked by the moderators/administrators because of: ${reason}`,
                    thumbnail: {
                        url: member.user.avatarURL
                    },
                    author: {
                        name: 'MODERATION'
                    }
                }
            });
            message.guild.channels.find('name', 'server-log').send({
                embed: {
                    color: red,
                    description: `**${member.user.username}** has been kicked by the moderators/administrators because of: ${reason}`,
                    thumbnail: {
                        url: member.user.avatarURL
                    },
                    author: {
                        name: 'MODERATION'
                    }
                }
            });

        })
        .catch(error => message.channel.send(`Sorry ${message.author} I couldn't kick that member because of : ${error}`));
}

//
// Ban members
//
function ban(message) {
    if (!message.member.hasPermission(['BAN_MEMBERS']))
        return message.channel.send(`${message.author} You sure about that? Apparently, **you don't have the required permissions.**`);
    let member = message.mentions.members.first();
    let reason = args[1];
    if (!reason)
        reason = 'No specific reason';
    member.ban(reason)
        .then(() => {
            message.channel.send({
                embed: {
                    color: red,
                    description: `**${member.user.username}** has been banned by the moderators/administrators because of: ${reason}`,
                    thumbnail: {
                        url: member.user.avatarURL
                    },
                    author: {
                        name: 'MODERATION'
                    }
                }
            });
            message.guild.channels.find('name', 'server-log').send({
                embed: {
                    color: red,
                    description: `**${member.user.username}** has been banned by the administrator`,
                    thumbnail: {
                        url: member.user.avatarURL
                    },
                    author: {
                        name: 'MODERATION'
                    }
                }
            });
        }
        )
        .catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban that member because of : ${error}`));

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
    if (!message.member.hasPermission(['MANAGE_CHANNELS']))
        return message.channel.send(`${message.author} You can't really do that can you? **You don't have the required permissions to manage channels!`);
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
// Deletes a channel
//
function deleteChannel(message) {
    if (!message.member.hasPermission(['MANAGE_CHANNELS']))
        return message.channel.send(`${message.author} Trying to be sneaky eh? **You don't have the required permissions to manage roles!`);
    let channel = message.mentions.channels.first();
    console.log(channel);
    try {
        if (channel) {
            channel.delete()
                .then(() => {
                    message.guild.channels.find('name', 'server-log').send({
                        embed: {
                            color: red,
                            description: `Channel **${channel.name}** was deleted by ${message.author}`,
                            author: {
                                name: 'CHANNEL DELETED'
                            }
                        }
                    })
                });
        } else message.channel.send(`**I can't really delete that channel mate!** Check if it even exists`);
    }
    catch (e) {
        console.log(e);
    }
}

//
// Creates a given role 
//
function _createRole(message) {

    // IF the member has required permissions
    if (!message.member.hasPermission(['MANAGE_ROLES']))
        return message.channel.send(`${message.author} Trying to be sneaky eh? **You don't have the required permissions to manage roles!`);

    let name = args[0];
    let color = args[1];
    if (!name)
        return message.reply('**Please enter a valid role name**');
    if (!color)
        color = 'DEFAULT';
    else
        color.toUpperCase();
    message.guild.createRole({
        name, color, mentionable: true
    })
        .then(log())
        .catch((e) => message.channel.send(e));


    // Send the log message to server-log
    function log() {
        message.guild.channels.find('name', 'server-log').send({
            embed: {
                color: blue,
                description: `Role **${name}** created by ${message.author}`,
                author: {
                    name: 'ROLE CREATED'
                }
            }
        });
    }
}

//
// Deletes a given role
//
function deleteRole(message) {
    if (!message.member.hasPermission(['MANAGE_ROLES']))
        return message.channel.send(`${message.author} Trying to be sneaky eh? **You don't have the required permissions to manage roles!**`);


    let role = message.mentions.roles.first();
    let roleName = role.name;
    if (!role)
        return message.reply('Please mention a valid role of this server mate!');
    if (!role.editable)
        return message.reply('I cannot remove this role! Do I have the permissions?');

    try {
        role.delete();
        message.guild.channels.find('name', 'server-log').send({
            embed: {
                color: red,
                description: `Role **${roleName}** deleted by ${message.author}`,
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


//
// Renames a given role 
//
function renameRole(message) {
    if (!message.member.hasPermission(['MANAGE_ROLES']))
        return message.channel.send(`${message.author} Trying to be sneaky eh? **You don't have the required permissions to manage roles!`);

    let role = message.mentions.roles.first();
    // Store the name in a var for backup
    let roleName = role.name;
    let name = args[1];
    if (!role)
        return message.reply('Please mention a valid role of this server mate!');
    if (!role.editable)
        return message.reply('I cannot remove this role! Do I have the permissions?');


    try {
        role.edit({ name });
        message.guild.channels.find('name', 'server-log').send({
            embed: {
                color: red,
                description: `Role **${roleName}** was renamed to **${name}** by ${message.author}`,
                author: {
                    name: 'ROLE MODIFIED'
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }


}

//
// Sends a warning to the channel mentioning the member as well as DMs the member
function warnMember(message) {
    let reason = args[1];
    let member = message.mentions.members.first();

    if (!reason)
        return message.channel.send(`${message.author}, please provide a reason for the warning`);

    message.channel.send({
        embed: {
            color: yellow,
            description: `${member} has been warned by ${message.author} for **${reason}**`,
            author: {
                name: 'WARNING',
                icon_url: message.author.avatarURL
            },
            thumbnail: {
                url: member.user.avatarURL
            }
        }
    });

    member.user.send({
        embed: {
            color: yellow,
            author: {
                icon_url: message.author.avatarURL
            },
            fields: [
                {
                    "name": "Warning",
                    "value": `You've been warned!`
                },
                {
                    "name": "Server",
                    "value": `${message.guild.name}`
                },
                {
                    "name": "Reason",
                    "value": `${reason}`
                }
            ]
        }
    });
}

//
// Sends a DM to multiple members
//
function bulkDM(message) {
    if (!message.member.hasPermission(['ADMINISTRATOR']))
        return message.channel.send(`${message.author}, **you don't have the required permissions!**`);
    // Declare an empty message array to push the message strings into later on
    let _message = [];

    // Untill a word starts with < (mention) keep adding it to the message
    for (let i in args) {
        if (args[i].indexOf('<') == -1)
            _message.push(args[i])
    }
    _message = _message.join(' ');

    // Get the snowflake separated 
    let users = args.splice(1, args.length);
    // Find every user in the array and sent them the message
    try {
        for (let i in users) {
            users[i] = users[i].split('').splice(2, users[i].length - 3).join('');
            bot.fetchUser(users[i]).then(user => user.send({
                embed: {
                    color: blue,
                    description: `${_message}`,
                    author: {
                        name: 'DM from Administrator'
                    }
                }
            }));
            message.guild.channels.find('name', 'server-log').send({
                embed: {
                    color: blue,
                    description: `Bulk DM sent successfully`
                }
            })
        }
    }
    catch (e) {
        console.log(e);
    }
}

function findWeather(message) {
    // Separate the city name from unit
    const city = args.splice(0, args.length - 1).join('');
    if (!city)
        return message.channel.send('**Please provide a valid city name along with preferred temperature unit (celsius/fahrenheit) in the syntax: <city>, <country> <unit></unit>**');
    // Set unit as metric or imperial
    const unit = args[0].toUpperCase() == 'C' ? 'metric' : 'imperial';
    // Also keep another variable for displaying unit in results
    const _unit = args[0].toUpperCase();
    const appID = config.appID;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${appID}`;
    let data;
    try {
        data = justGetJSON(url);
    }
    catch (e) {
        message.channel.send(e);
    }

    const cityName = data.name;
    const countryCode = data.sys.country;
    const temp = data.main.temp;
    const condition = data.weather[0].main;
    const humidity = data.main.humidity;

    message.channel.send({
        embed: {
            color: blue,
            description: `Here are the weather conditions for **${cityName}, ${countryCode}**`,
            author: {
                name: 'WEATHER'
            },
            fields: [
                {
                    "name": "Temperature",
                    "value": `${temp}°${_unit}`
                },
                {
                    "name": "Sky",
                    "value": `${condition}`
                },
                {
                    "name": "Humidity",
                    "value": `${humidity}`
                }
            ]
        }
    });
}
// Under development
function _help(message) {
    for (let i in help) {
        message.author.send(`
            ${message.author} \n
            **${help[i].name}** \n
            \t__*Description*__: **${help[i].description}** \n
            \t__*Command*__: **${help[i].command}** \n
            \t__*Syntax*__:  **${help[i].syntax}** \n
            \t__*Example*__:  **${help[i].example}** \n
            `
        );
    }
}