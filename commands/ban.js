const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (client, message, [mention, ...reason]) => {
  if (!message.member.hasPermission(['BAN_MEMBERS'])) {
    return message.channel.send(`${message.author} You sure about that? Apparently, **you don't have the required permissions.**`)
  }
  let member = message.mentions.members.first()
  if (!reason) {
    reason = 'No specific reason'
  } else {
    reason = reason.join(' ')
  }

  member.ban(reason)
    .then(() => {
      message.channel.send({
        embed: {
          color: colors.red,
          description: `**${member.user.username}** has been banned by the moderators/administrators because of: ${reason}`,
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
          description: `**${member.user.username}** has been banned by the administrator`,
          thumbnail: {
            url: member.user.avatarURL
          },
          author: {
            name: 'MODERATION'
          },
          fields: [
            {
              'name': 'Reason',
              'value': `${reason}`
            }
          ]
        }
      })
    }
    )
    .catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban that member because of : ${error}`))
}
