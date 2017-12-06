//
// Check for vulgar comments
//
const fs = require('fs')
const badwords = require('badwords/array')
const _colors = require('../colors.json')
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
exports.run = (bot, message) => {
  let settings
  try {
    settings = JSON.parse(fs.readFileSync(`./data/${message.guild.id}.json`, 'utf8'))
  }
  catch (e) {
    console.log(e)
  }
  if (!settings) {
    return
  }

  const filterProfanityChannels = settings.filterprofanity
  if (filterProfanityChannels) {
    try {
      for (let i in filterProfanityChannels) {
        // Check if channel is in filter invites array and message contains profanity
        if (message.channel.id === filterProfanityChannels[i]) {
          let _message = message.content.toLowerCase()
          _message = _message.split(' ')
          for (let i in _message) {
            for (let j in badwords) {
              if (_message[i] === badwords[j]) {
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
                return
              }
            }
          }
        }
      }
    }
    catch (e) {
      console.log(e)
    }
  }
}
