const fs = require('fs')
const _colors = require('../colors.json')

const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

function convertChannelIdToName (message, channels) {
  let _channels = []
  let _channel
  // map wasn't used since it can't handle null values
  for (let i in channels) {
    if (channels[i]) {
      _channel = message.guild.channels.find('id', channels[i])
      _channels.push(_channel)
    }
  }
  if (_channels.length > 0) return _channels
  else return 'None'
}

function convertBooltoEmoji (value) {
  return value === 'true' ? `:white_check_mark:` : `:x:`
}

exports.run = (bot, message, args) => {
  const data = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`, 'utf8'))
  let filterinvites = convertChannelIdToName(message, data.filterinvites)
  let filterlinks = convertChannelIdToName(message, data.filterlinks)

  let autoRole = message.guild.roles.find('id', data.autoroleID)

  if (!autoRole) { autoRole = 'Not set' }

  message.channel.send({
    embed: {
      color: colors.blue,
      description: `Server data for Terone`,
      thumbnail: {
        url: message.guild.iconURL
      },
      author: {
        name: 'SETTINGS'
      },
      fields: [{
        'name': 'Prefix',
        'value': `${data.prefix}`,
        'inline': true
      }, {
        'name': 'Welcome Channel',
        'value': `${message.guild.channels.find('name', data.welcomechannel)}`,
        'inline': true
      }, {
        'name': 'Automatic Role',
        'value': `${autoRole}`,
        'inline': true
      }, {
        'name': 'Server Log',
        'value': `${convertBooltoEmoji(data.serverlog)}`,
        'inline': true
      }, {
        'name': 'Member Log',
        'value': `${convertBooltoEmoji(data.memberlog)}`,
        'inline': true
      }, {
        'name': 'Automatic Welcome',
        'value': `${convertBooltoEmoji(data.autowelcome)}`,
        'inline': true
      }, {
        'name': 'Filter Invites',
        'value': `${filterinvites}`,
        'inline': true
      }, {
        'name': 'Filter Links',
        'value': `${filterlinks}`,
        'inline': true
      }

      ]
    }
  })
}
