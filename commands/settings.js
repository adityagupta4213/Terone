const fs = require('fs')
const _colors = require('../colors.json')

const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

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
      fields: [
        {
          'name': 
        }
      ]
    }
  })
}
