//
// Check for vulgar comments
//

const badwords = require('badwords/array')
const _colors = require('../colors.json')
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message) => {
  let _message = message.content.toLowerCase()
  _message = _message.split(' ')
  for (let i in _message) {
    for (let j in badwords) {
      if (_message[i] === badwords[j]) {
        console.log(_message[i])
        message.delete()
        message.channel.send({
          embed: {
            color: colors.red,
            description: `No profanity ${message.author}!`,
            thumbnail: {
              url: message.author.avatarURL
            },
            author: {
              name: 'PROFANITY DETECTED'
            }
          }
        })
        break
      }
    }
  }
  return true
}
