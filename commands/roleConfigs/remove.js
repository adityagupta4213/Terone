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
    let member = message.mentions.members.first()
    let roles = message.mentions.roles
    if (!member) {
      return message.reply(`Please specify a member to remove the roles from.`)
    }
    if (!roles) {
      return message.reply(`Please specify the roles to be removed`)
    }
    roles = roles.filter(role => member.roles.find('id', role.id))
    if (!roles) {
      return message.reply(`No removeable roles found.`)
    }
    try {
      member.removeRoles(roles)
          .then(member => {
            // log(message, member, filepath, roles)
            return message.channel.send({
              embed: {
                color: colors.blue,
                description: `The specified role(s) were removed from ${member.user.username}.`
              }
            })
          })
          .catch(e => {
            console.log(e)
            return message.reply(`Couldn't take away the role(s) due to an error: ${e}`)
          })
    } catch (e) {
      return console.log(e)
    }
  } else {
    message.reply(`You don't have the required permissions.`)
  }
}

function log (message, member, filepath, roles) {
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
    roles = roles.map(role => role.name)
    try {
      message.guild.channels.find('name', 'server-log').send({
        embed: {
          color: colors.blue,
          description: `The following role(s) were removed from ${member.user.username} by ${message.author.username}\n${roles}`,
          thumbnail: {
            url: message.author.avatarURL
          },
          author: {
            name: `ROLES UPDATE`
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}
