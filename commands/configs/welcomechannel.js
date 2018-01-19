const fs = require('fs')

exports.run = (bot, message, filepath, [args]) => {
  const guild = message.guild
  let channel = message.mentions.channels.first()
  let data = JSON.parse(fs.readFileSync(`${filepath}${guild.id}.json`, 'utf8'))
  if (!channel) {
    return message.reply(`Please specify an existing channel to automatically welcome new users`)
  }

  data.welcomechannel = channel.name

  fs.writeFile(`${filepath}${guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`**Automatic Welcome Channel** was successfully set to **${channel.name}**`)
  })
}
