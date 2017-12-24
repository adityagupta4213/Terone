const fs = require('fs')
const _colors = require('../../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
exports.run = (bot, message, filepath, args) => {
  if (!message.member.hasPermission(['MANAGE_ROLES'])) {
    return message.channel.send(`${message.author} Trying to be sneaky eh? **You don't have the required permissions to manage roles!**`)
  }

  let role = message.mentions.roles.first()
  if (!role) {
    return message.reply('Please mention a valid role of this server!')
  }
  if (!role.editable) {
    return message.reply('I cannot remove this role! Do I have the permissions?')
  }
  try {
    role.delete()
      .then(
        log(message, filepath, role.name)
      )
  } catch (e) {
    message.reply(`Couldn't delete role ${role.name} due to: ${e}`)
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
          color: colors.red,
          description: `Role **${name}** deleted by ${message.author}`,
          author: {
            name: 'ROLE DELETED'
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
