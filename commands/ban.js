const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [mention, ...reason]) => {
  if (!message.member.hasPermission(['BAN_MEMBERS'])) {
    return message.reply(`You sure about that? Apparently, **you don't have the required permissions.**`)
  }
  let member = message.mentions.members.first()
  if (member.user.id === bot.user.id) {
    return message.reply(`Hey I can't ban myself! I ain't that dumb mate.`)
  }
  if (reason = []) {
    reason = 'No specific reason'
  }

  member.ban(reason)
    .then(() => {
      message.channel.send({
        embed: {
          color: colors.red,
          description: `**${member.user.username}** has been banned by the moderators/administrators due to: ${reason}`,
          thumbnail: {
            url: member.user.avatarURL
          },
          author: {
            name: 'MODERATION'
          }
        }
      })
      log(message, member, reason)
    })
    .catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban that member because of : ${error}`))
}

function log(message, member, reason) {
  let serverlog
  try {
    let settings
    try {
      settings = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`, 'utf8'))
    }
    catch (e) {
      console.log(e)
    }
    serverlog = settings.serverlog
  }
  catch (e) {
    console.log(e)
  }
  if (serverlog !== 'false') {
    try {
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
          fields: [{
            'name': 'Reason',
            'value': `${reason}`
          }]
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  }
}
