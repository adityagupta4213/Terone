const fs = require('fs')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
exports.run = (bot, message, ...args) => {
  if (message.member.hasPermission(['MANAGE_role'])) {
    let member = message.mentions.members.first()
    let role = message.mentions.roles.first()
    if (!member.roles.find('id', role.id)) {
      member.addRole(role)
        .then(member => {
          log(message, member, role)
          return message.channel.send({
            embed: {
              color: colors.blue,
              description: `${member.user.username} was successfully assigned the specified role(s).`
            }
          })
          return message.reply()
        })
        .catch(e => {
          console.log(e)
          return message.reply(`Couldn't assign the role(s) due to an error: ${e}`)
        })
    }
    else {
      return message.channel.send({
        embed: {
          color: colors.blue,
          description: 'Member already has the specified role'
        }
      })
    }
  }
}

function log(message, member, role) {
  let memberLog
  try {
    let settings
    try {
      settings = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`, 'utf8'))
    }
    catch (e) {
      console.log(e)
    }
    memberLog = settings.memberlog
  }
  catch (e) {
    console.log(e)
  }
  if (memberLog !== 'false') {
    try {
      message.guild.channels.find('name', 'member-log').send({
        embed: {
          color: colors.blue,
          description: `${member.user.username} was given the role(s)\n**${role.name}**\n by ${message.author.username}`,
          thumbnail: {
            url: message.author.avatarURL
          },
          author: {
            name: `ROLES UPDATE`
          }
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  }
}
