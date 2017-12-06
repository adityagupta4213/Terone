const fs = require('fs')

exports.run = (bot, message, [game, ign, ...args]) => {
  if (!ign)
    return message.reply(`Please specify an IGN`)
  const filepath = `${__dirname}/../data/${message.guild.id}.json`

  let data = JSON.parse(fs.readFileSync(filepath, 'utf8'))

  let ignArray = data.ign[message.author.id]
  let doesGameExist = false

  for (let i in ignArray) {
    if (ignArray[i].game === game) {
      ignArray[i].name = ign
    }
    else doesGameExist = false
  }

  if (!doesGameExist) {
    ignArray.push({
      game,
      ign
    })
  }

  fs.writeFile(`${filepath}${message.guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`The IGN for ${game} was set to ${ign}`)
  })
}
