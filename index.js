const Discord = require('discord.js')
const Music = require('discord.js-musicbot-addon')
const fs = require('fs')
const config = require('./config.json')
const ai = require('./commands/ai.js')
const initialize = require('./commands/init.js')
const checkProfanity = require('./commands/checkProfanity.js')
const filterHandler = require('./commands/filterHandler.js')
const colors = require('./colors.json')

const bot = new Discord.Client({
  autoReconnect: true
})
const music = new Music(bot, {
  prefix: config.mPrefix,
  maxQueueSize: '200',
  helpCmd: 'mhelp',
  playCmd: 'play',
  leaveCmd: 'leave',
  enableQueueStat: true,
  clearInvoker: true,
  anyoneCanSkip: true,
  ownerOverMember: true,
  requesterName: true,
  botOwner: config.owner.id,
  youtubeKey: config.youtube
})

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
  // Load settings for the guild and fetch the prefix

  // Check for filters
  filterHandler.run(bot, message)
  checkProfanity.run(bot, message)

  let prefix
  let mPrefix
  if (message.guild) {
    let filepath = `${__dirname}/data/${message.guild.id}.json`
    let settings
    try {
      settings = JSON.parse(fs.readFileSync(filepath, 'utf8'))
    } catch (e) {
      console.log(e)
      initialize.run(bot, message, 'Critical error')
    }

    try {
      prefix = settings.prefix
      mPrefix = settings.mPrefix
    } catch (e) {
      console.log('Error', e, 'SERVER', message.guild.name)
    }
  } else if (!message.guild && message.content.indexOf(prefix) !== -1) {
    return message.channel.send({
      embed: {
        color: parseInt(colors.yellow),
        description: 'You need to [add me to a server](https://discordapp.com/oauth2/authorize?client_id=356369928426749952&scope=bot&permissions=1007119423) for any of my commands to work mate!'
      }
    })
  }
  // If bot is mentioned but command is not given else if command is not given
  if (message.isMentioned(bot.user) && !message.content.startsWith(prefix)) {
    return ai.run(bot, message)
  }
  // If both, prefix and music prefix aren't present
  else if (!message.content.startsWith(prefix) && !message.content.startsWith(mPrefix)) return
  // This is the best way to define args. Trust me.
  let args = message.content.slice(prefix.length).trim().split(/ +/g)
  let command = args.shift().toLowerCase()

  // If a command other than "set" contains the prefix, declare invalid
  for (let i in args) {
    if (args[i].startsWith(prefix) && command !== 'set') {
      args = 0
      command = 0
      return message.reply('Incorrect syntax')
    }
  }
  if (!message.content.startsWith(mPrefix)) {
    try {
      let commandFile = require(`./commands/${command}.js`)
      commandFile.run(bot, message, args)
    } catch (err) {
      console.log(err)
      message.reply('Command not found. Use the `${prefix}help` command to get my command guide delivered to your inbox')
    }
  }
  // Check for profanity
  checkProfanity.run(bot, message)
})

bot.login(config.token)
