const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [mention, ...reason]) => {
  if (!message.member.hasPermission(['KICK_MEMBERS'])) {
    return message.reply(`You don't have the permissions for warning members. You need to be able to kick members.`)
  }
  let member = message.mentions.members.first()

  if (!member) {
    return message.channel.send(`${message.author}, please mention the name of the member to warn`)
  }
  if (member.user === message.author) {
    return message.channel.send(`${message.author}, you can't warn yourself mate :D`)
  }
  if (!reason) {
    return message.channel.send(`${message.author}, please provide a reason for the warning`)
  }
  else {
    reason = reason.join(' ')
  }

  message.channel.send({
    embed: {
      color: colors.yellow,
      description: `${member} has been warned by ${message.author} for **${reason}**`,
      author: {
        name: 'WARNING',
        iconURL: message.author.avatarURL
      },
      thumbnail: {
        url: member.user.avatarURL
      }
    }
  })

  member.user.send({
    embed: {
      color: colors.yellow,
      author: {
        iconURL: message.author.avatarURL
      },
      fields: [{
        'name': 'Warning',
        'value': `You've been warned!`
      }, {
        'name': 'Server',
        'value': `${message.guild.name}`
      }, {
        'name': 'Reason',
        'value': `${reason}`
      }]
    }
  })
}
