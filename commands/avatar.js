const config = require('../config.json')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [member]) => {
  const user = message.mentions.users.first()
  if (!user) return message.reply('Mention a valid user to get the avatar from')
  if (!user.avatarURL) user.avatarURL = user.defaultAvatarURL
  message.channel.send({
    embed: {
      color: colors.blue,
      author: {
        name: user.username
      },
      description: `Avatar URL: ${user.avatarURL}`,
      image: {
        url: user.avatarURL
      }
    }
  })
}
