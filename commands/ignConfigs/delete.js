const _colors = require('../../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
const fs = require('fs')
const config = require('../../config.json')
exports.run = (bot, message, filepath, [game]) => {
  game = message.mentions.roles.first()
  if (!game) {
    return message.reply(`Please specify a game to delete the IGN for. It needs to be a pre-created role.`)
  }

  let data = JSON.parse(fs.readFileSync(`${filepath}${message.guild.id}.json`, 'utf8'))
  const errMsg = `Your IGN for the game ${game} does not exist. Use the following command to add it \`\`\`${config.prefix}ign add @gameRole yourIGN\`\`\``
  let gameFound = true
  if (data.ign.length > 0) {
    for (let i in data.ign) {
      if (data.ign[i].id === message.author.id) {
        for (let j in data.ign[i].games) {
          if (data.ign[i].games[j].gameID === game.id) {
            data.ign[i].games.splice(j, 1)
          } else {
            gameFound = false
          }
        }
      } else {
        gameFound = false
      }
      break
    }
  } else {
    gameFound = false
  }
  if (!gameFound) {
    return message.reply(errMsg)
  }

  fs.writeFile(`${filepath}${message.guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`Your IGN for the game **${game}** was successfully removed.`)
  })
}
