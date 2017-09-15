const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [channelName, channelType]) => {
  if (!message.member.hasPermission(['MANAGE_CHANNELS'])) {
    return message.channel.send(`${message.author} You can't really do that can you? **You don't have the required permissions to manage channels!`)
  }
  if (!channelName) {
    return message.channel.send(`${message.author} You didn't specify a channel name`)
  }

  if (!channelType) {
    return message.channel.send(`${message.author} You didn't specify a channel type. Either enter \`text\` or \`voice\` as the type`)
  }
  try {
    if (!message.guild.channels.exists('name', channelName)) {
      message.guild.createChannel(channelName, channelType)
        .then(() => {
          let creationTime = message.guild.channels.find('name', channelName).createdAt
          message.guild.channels.find('name', 'server-log').send({
            embed: {
              color: colors.blue,
              description: `Channel **${channelName}** created by ${message.author} at ${creationTime}`,
              author: {
                name: 'CHANNEL CREATED'
              }
            }
          })
        })
    }
  } catch (e) {
    console.log(e)
  }
}
