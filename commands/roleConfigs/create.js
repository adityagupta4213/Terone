const fs = require('fs')
const _colors = require('../../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
exports.run = (bot, message, filepath, args) => {
  if (message.member.hasPermission(['MANAGE_ROLES'])) {
    let name = args[0]
    let color = args[1]
    if (!name) {
      return message.reply(`Please specify a role name.`)
    }
    if (!color) {
      color = 'DEFAULT'
    } else if (color) {
      color = color.toUpperCase()
    }
    if (message.guild.roles.find('name', name)) {
      return message.reply(`Role **${name}** already exists.`)
    }
    message.guild.createRole({
      name,
      color,
      mentionable: true
    })
    .then(() => {
      message.reply(`The role **${name}** was created successfully.`)
      log(message, filepath, name)
    })
    .catch((e) => console.log(e))
  }
}

function log (message, filepath, name) {
  let serverLog
  try {
    let settings
    try {
      settings = JSON.parse(fs.readFileSync(`${filepath}${message.guild.id}.json`, 'utf8'))
    } catch (e) {
      console.log(e)
    }
    serverLog = settings.serverlog
  } catch (e) {
    console.log(e)
  }
  if (serverLog !== 'false') {
    try {
      message.guild.channels.find('name', 'server-log').send({
        embed: {
          color: colors.blue,
          description: `Role **${name}** created by ${message.author}`,
          author: {
            name: 'ROLE CREATED'
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
