const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (client, message, [mention, ...reason]) => {
  if (!message.member.hasPermission(['KICK_MEMBERS'])) {
    return message.reply(`Sorry, you don't have permissions to use this!`)
  }

  // Check if member exsits and is kicable
  let member = message.mentions.members.first()

  if (!reason) {
    reason = 'No specified reason'
  } else {
    reason = reason.join(' ')
  }

  if (!member) {
    return message.reply('Please mention a valid member of this server')
  }
  if (!member.kickable) {
    return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?')
  }
  member.kick(reason)
    .then(() => {
      message.channel.send({
        embed: {
          color: colors.red,
          description: `**${member.user.username}** has been kicked by the moderators/administrators because of: ${reason}`,
          thumbnail: {
            url: member.user.avatarURL
          },
          author: {
            name: 'MODERATION'
          }
        }
      })
      message.guild.channels.find('name', 'server-log').send({
        embed: {
          color: colors.red,
          description: `**${member.user.username}** has been kicked by the moderators/administrators because of: ${reason}`,
          thumbnail: {
            url: member.user.avatarURL
          },
          author: {
            name: 'MODERATION'
          }
        }
      })
    })
    .catch(error => message.channel.send(`Sorry ${message.author} I couldn't kick that member because of : ${error}`))
}
