const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message) => {
  const guild = message.guild
  const time = Date.parse(new Date()) - guild.createdTimestamp
  const days = Math.floor(time / (1000 * 60 * 60 * 24))
  message.channel.send({
    embed: {
      color: colors.blue,
      description: `Here's the server information for ${guild.name}`,
      thumbnail: {
        url: guild.iconURL
      },
      author: {
        name: 'SERVER INFORMATION'
      },
      fields: [
        {
          'name': 'Name',
          'value': `${guild.name}`
        },
        {
          'name': 'Owner',
          'value': `${guild.owner.user}`
        },
        {
          'name': 'Date of Creation',
          'value': `${guild.createdAt}`
        },
        {
          'name': 'Age',
          'value': `${days} days`
        },
        {
          'name': 'Channels',
          'value': `${guild.channels.size}`,
          'inline': true
        },
        {
          'name': 'Members',
          'value': `${guild.memberCount}`,
          'inline': true
        },
        {
          'name': 'Roles',
          'value': `${guild.roles.size}`,
          'inline': true
        }
      ]
    }
  })
}
