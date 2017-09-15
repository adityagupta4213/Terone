const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [...string]) => {
  string = string.join(' ')
  message.channel.send({
    embed: {
      color: colors.green,
      description: `${string}`,
      author: {
        iconUrl: bot.user.avatarURL
      }
    }
  })
}
