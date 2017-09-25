const fs = require('fs')
const _colors = require('../colors.json')
const config = require('../config.json')
const requiredChannels = config.requiredChannels
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

const initialData = {
  'prefix': '++',
  'serverlog': 'false',
  'memberlog': 'false',
  'welcomechannel': 'welcome',
  'filterinvites': ["none"],
  'filterlinks': ["none"]
}

exports.run = (bot, message, args) => {
  const guild = message.guild

  fs.writeFile(`./data/${guild.id}.json`, JSON.stringify(initialData), err => {
    console.log(err)
  })

  let didInit = true
  for (let i in requiredChannels) {
    if (!guild.channels.exists('name', requiredChannels[i])) {
      try {
        guild.createChannel(requiredChannels[i], 'text')
        didInit = true
      }
      catch (e) {
        console.log(e)
        didInit = false
      }
    }
  }
  if (didInit) {
    return message.reply(`The server has been reinitialize. Use the \`settings\` command to view settings`)
  }
  else {
    return message.reply('Initialization failed. Please check if I have administrative permissions.')
  }
}
