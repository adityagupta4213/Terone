const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [channelName, channelType]) => {
  if (!message.member.hasPermission(['MANAGE_CHANNELS'])) {
    return message.channel.send(`${message.author} Trying to be sneaky eh? **You don't have the required permissions to manage roles!`)
  }
  let channel = message.mentions.channels.first()
  console.log(channel)
  try {
    if (channel) {
      channel.delete()
        .then(() => {
          message.guild.channels.find('name', 'server-log').send({
            embed: {
              color: colors.red,
              description: `Channel **${channel.name}** was deleted by ${message.author}`,
              author: {
                name: 'CHANNEL DELETED'
              }
            }
          })
        })
    } else message.channel.send(`**I can't really delete that channel mate!** Check if it even exists`)
  } catch (e) {
    console.log(e)
  }
}
