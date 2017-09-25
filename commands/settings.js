const fs = require('fs')
const _colors = require('../colors.json')

const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

function convertChannelIdToName(message, channel) {
  let _channel = message.guild.channels.find('id', channel)
  return ` ${_channel}`
}

function convertBooltoEmoji(value) {
  return value == 'true' ? `:white_check_mark:` : `:x:`
}

exports.run = (bot, message, args) => {
  const settings = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`, 'utf8'))
  message.channel.send({
    embed: {
      color: colors.blue,
      description: `Server settings for Terone`,
      thumbnail: {
        url: message.guild.iconURL
      },
      author: {
        name: 'SETTINGS'
      },
      fields: [{
          'name': 'Prefix',
          'value': `${settings.prefix}`
        }, {
          'name': 'Server Log',
          'value': `${convertBooltoEmoji(settings.serverlog)}`,
          'inline': true
        }, {
          'name': 'Member Log',
          'value': `${convertBooltoEmoji(settings.memberlog)}`,
          'inline': true
        }, {
          'name': 'Welcome Channel',
          'value': `${message.guild.channels.find('name', settings.welcomechannel)}`
        }, {
          'name': 'Filter Invites',
          'value': `${settings.filterinvites.map(channel=>convertChannelIdToName(message, channel))}`,
          'inline': true
        }, {
          'name': 'Filter Links',
          'value': `${settings.filterlinks.map(channel=>convertChannelIdToName(message, channel))}`,
          'inline': true
        },

      ]
    }
  })
}
