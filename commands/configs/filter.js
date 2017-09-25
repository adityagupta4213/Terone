const fs = require('fs')

exports.run = (bot, message, filepath, [type, _channel, action]) => {
  const channel = message.mentions.channels.first()
  const channelID = channel.id
  if (!channel) {
    return message.reply(`Please specify a channel to filter invites from.`)
  }
  const guild = message.guild
  let data = JSON.parse(fs.readFileSync(`${filepath}${guild.id}.json`, 'utf8'))
  let filterType = `filter${type}`

  if (action === 'add') {
    for (let i in data[filterType]) {
      if (channelID === data[filterType][i]) {
        return message.reply(`Channel **${channel.name}** already exists`)
      }
    }
    data[filterType].push(channelID)
  } else if (action === 'remove') {
    const index = data[filterType].indexOf(channelID)
    if (index !== -1) {
      data[filterType].splice(index, 1)
    } else {
      return message.reply(`Channel **${channel.name}** was not found in the ${type} filter`)
    }
  } else {
    return message.reply('Invalid action')
  }

  let responseMessage = action === 'add' ? 'added' : 'removed'
  fs.writeFile(`${filepath}${guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`${type} filter: channel **${channel.name}** was successfully **${responseMessage}**`)
  })
}
