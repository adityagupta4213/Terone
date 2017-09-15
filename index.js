const Discord = require('discord.js')
const fs = require('fs')
const config = require('./config.json')
const ai = require('./commands/ai.js')
const checkProfanity = require('./commands/checkProfanity.js')
const colors = require('./colors.json')

const bot = new Discord.Client()
const prefix = config.prefix

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`)
    let eventName = file.split('.')[0]
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
  })
})

bot.on('message', message => {
  if (message.author.bot) return
  // If bot is mentioned but command is not given
  if (message.isMentioned(bot.user) && message.content.indexOf(config.prefix) === -1) ai.run(bot, message)

  // This is the best way to define args. Trust me.
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  let command = args.shift().toLowerCase()

  for (let i in args) {
    if (args[i].indexOf('++') !== -1) {
      args = 0
      command = 0
      return message.reply('you cannot use multiple commands at once.')
    }
  }

  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`./commands/${command}.js`)
    commandFile.run(bot, message, args)
  } catch (err) {
    console.error(err)
    message.reply('This doesn\'t seem like a valid command. Does it?')
  }
  // Check for profanity
  checkProfanity.run(bot, message)

  // If bot is in a DM channel and a command is received
  if (!message.guild && message.content.indexOf(prefix) !== -1) {
    return message.channel.send({
      embed: {
        color: parseInt(colors.yellow),
        description: 'You need to [add me to a server](https://discordapp.com/oauth2/authorize?client_id=356369928426749952&scope=bot&permissions=1007119423) for any of my commands to work mate!'
      }
    })
  }
})

//
// Sends a DM to multiple members
//
/*
function bulkDM (message) {
  if (!message.member.hasPermission(['ADMINISTRATOR'])) {
    return message.channel.send(`${message.author}, **you don't have the required permissions!**`)
  }
  // Declare an empty message array to push the message strings into later on
  let _message = []

  // Untill a word starts with < (mention) or @everyone, keep adding it to the message
  for (let i in args) {
    if (args[i].indexOf('<') === -1 && args[i].indexOf('@') === -1) _message.push(args[i])
  }
  _message = _message.join(' ')

  // Get the snowflake separated
  let users = args.splice(1, args.length)
  let isEveryoneMentioned = false

  // If everyone is mentioned, find every member of the guild and push their user ID to users array
  if (users[0] === '@everyone') {
    isEveryoneMentioned = true
    message.guild.fetchMembers().then(guild => {
      users = guild.members.keyArray()
      sendMsg(users)
    })
  }
  // Only separate IDs from mentions if @everyone is not mentioned
  if (!isEveryoneMentioned) {
    for (let i in users) {
      users[i] = users[i].split('').splice(2, users[i].length - 3).join('')
    }
    sendMsg(users)
  }
  // Find every user in the array and sent them the message
  function sendMsg (users) {
    try {
      for (let i in users) {
        bot.fetchUser(users[i]).then(user => {
          user.send({
            embed: {
              color: colors.blue,
              description: `You've received a message from the administrator`,
              author: {
                name: 'DM from Administrator'
              },
              fields: [
                {
                  name: 'Server',
                  value: `${message.guild.name}`
                },
                {
                  name: 'Message',
                  value: `${_message}`
                },
                {
                  name: 'Time',
                  value: `${new Date(message.createdTimestamp)}`
                }
              ]
            }
          })
        })
      }
      message.guild.channels.find('name', 'server-log').send({
        embed: {
          color: colors.blue,
          description: `Bulk DM sent successfully`
        }
      })
      message.channel.send({
        embed: {
          color: colors.blue,
          description: `Bulk DM sent successfully`
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
*/

bot.login(config.token)
