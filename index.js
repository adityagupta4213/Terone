const Discord = require('discord.js');
const translate = require('google-translate-api');
const isoConv = require('iso-language-converter');
const config = require('./config.json');
const bot = new Discord.Client();
const greetings = ['Hi!', 'Hey there!', 'Hello'];
var channelGeneral;

bot.on('message', message => {

    // Only run if bot is mentioned
    if (message.isMentioned(bot.user)) {

        // Store the content in a temp var
        let _message = message.content;
        // Split the message, remove the bot mention, rejoin and then remove the + prefix
        _message = _message.split(' ');
        _message.splice(0, 1);
        const args = _message.join(' ').slice(1).trim().split(/ +/g);
        // Separate the command from the arguments
        const command = args.shift().toLowerCase();

        console.log('command: ', command, 'args: ', args);

        //
        // General greetings //
        //

        // Convert to lowercase in order to deal with all variations of spellings
        _message = message.content.toLowerCase();
        const substring = ['hi', 'hey', 'hello', 'sup', 'morning'];
        // Prevent greetings if any command is given (eg. +translate hello fr would not make the bot say hello along with the result)
        if (_message.indexOf('+') == -1) {
            // If the user is a bot itself, don't do anything in order to prevet unwanted loops
            if (message.author.bot) return;
            for (let i in substring) {
                // Check the whole sentence for greetings instead of just the trigger command
                if (_message.indexOf(substring[i]) !== -1) {
                    let index = Math.floor(Math.random() * 3);
                    message.reply(greetings[index]);
                }
            }
        }

        //
        // Purge //
        //

        if (command == 'purge') {
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

        if (command == 'translate') {
            let string = [];
            // Transfer the word(s) to another array
            for (let i = 0; i < args.length - 1; i++) {
                string[i] = args[i];
            }

            string = string.join('');

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
                message.channel.send(`Translation from ${isoConv(result.from.language.iso)}: ${result.text}`);
            }).catch(err => {
                message.channel.send(`An error occured while attempting translate ${err}`);
            });
        }
    }
})
    ;
//


// Greet users when they come online or go offline
//
bot.on('presenceUpdate', (oldMember, newMember) => {
    if (oldMember.presence.status !== newMember.presence.status && newMember.presence.status == 'online') {
        let index = Math.floor(Math.random() * 3);
        // So that each instance sends message to its own server instead of every server
        newMember.guild.channels.find("name", "general").send(`${greetings[index]} ${newMember.user}. Welcome back :raising_hand:`);
        console.log(`${newMember.user.username} is now ${newMember.presence.status}`);
    }
});

bot.on('guildMemberAdd', function () {

})

bot.login(config.token);