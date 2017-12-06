const search = require('youtube-search')
const config = require('../config.json')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [...query]) => {
  query = query.join('%20')
  const opts = {
    maxResults: 1,
    key: config.youtube
  }

  search(query, opts, function (err, results) {
    console.log(results)
    if (err) return console.log(err)
    if (!results) return message.reply(`No match found`)
    message.channel.send({
      embed: {
        color: colors.blue,
        description: `${results[0].description}`,
        author: {
          name: `${results[0].title}`
        },
        fields: [{
          'name': 'Channel',
          'value': `${results[0].channelTitle}`
        }, {
          'name': 'Link',
          'value': `${results[0].link}`
        }],
        image: {
          url: `${results[0].thumbnails.high.url}`
        },
        footer: {
          text: `Published: ${results[0].publishedAt}`
        }
      }
    })
  })
}
