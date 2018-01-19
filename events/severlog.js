const fs = require('fs')

exports.run = (bot, message, filepath, [value]) => {
  if (value !== 'true' && value !== 'false') {
    return message.reply(`The value for this setting can either only be true or false.`)
  }
  const guild = message.guild
  let data = JSON.parse(fs.readFileSync(`${filepath}${guild.id}.json`, 'utf8'))

  data.serverlog = value

  fs.writeFile(`${filepath}${guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`**Server log** was successfully set to **${value}**`)
  })
}
