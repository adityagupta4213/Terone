const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, member) => {
  member = message.mentions.members.first()
  if (!member) {
    return message.reply('Umm...Whom should I welcome? **Please mention the member to be welcomed**')
  }
  const membershipTime = Date.parse(new Date()) - member.joinedTimestamp
  const days = Math.floor(membershipTime / (1000 * 60 * 60 * 24))

  message.channel.send({
    embed: {
      color: colors.blue,
      description: `**Welcome** ${member.user}, you've been a part of **${message.guild.name}** since ${days} days`,
      thumbnail: {
        url: member.user.avatarURL
      },
      author: {
        name: 'WELCOME'
      },
      fields: [
        {
          'name': 'Member Since',
          'value': `${member.joinedAt}`
        }
      ]
    }
  })
}
