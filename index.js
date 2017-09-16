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
    // super-secret recipe to call events with all their proper arguments *after* the `bot` var.
    bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
  })
})

bot.on('message', message => {
  if (message.author.bot) return
  // If bot is mentioned but command is not given
  if (message.isMentioned(bot.user) && message.content.indexOf(config.prefix) === -1) ai.run(bot, message)
  else if (message.content.indexOf(config.prefix) === -1) return
  // This is the best way to define args. Trust me.
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  let command = args.shift().toLowerCase()

  for (let i in args) {
    if (args[i].indexOf('++') !== -1) {
      args = 0
      command = 0
      return message.reply('Incorrect syntax')
    }
  }

  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`./commands/${command}.js`)
    commandFile.run(bot, message, args)
  } catch (err) {
    console.error(err)
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

  // Points system
})

bot.login(config.token)
