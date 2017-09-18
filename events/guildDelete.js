const config = require('../config.json')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, guild) => {
  bot.channels.find('id', config.teroneLog).send({
    embed: {
      color: colors.red,
      description: `Terone is no longer a member of **${guild.name}**`,
      thumbnail: {
        url: guild.iconURL
      },
      author: {
        name: 'SERVER LEFT'
      },
      fields: [
        {
          'name': 'Owner',
          'value': `${guild.owner}`
        },
        {
          'name': 'Server Region',
          'value': `${guild.region}`
        },
        {
          'name': 'Server ID',
          'value': `${guild.id}`
        },
        {
          'name': 'Joined at',
          'value': `${guild.joinedAt}`
        },
        {
          'name': 'Members',
          'value': `${guild.memberCount}`
        }
      ]
    }
  })
}
