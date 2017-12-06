const fs = require('fs')

exports.run = (bot, message, filepath, [value]) => {
  if (typeof (value) === 'object' && value.length > 1) {
    return message.reply(`You can't have spaces in the prefix`)
  }
  const guild = message.guild
  let data = JSON.parse(fs.readFileSync(`${filepath}${guild.id}.json`, 'utf8'))

  data.mPrefix = value

  fs.writeFile(`${filepath}${guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`**Music prefix** was successfully set to **${value}**`)
  })
}
