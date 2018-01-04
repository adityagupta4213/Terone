const _colors = require('../../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
const fs = require('fs')

exports.run = (bot, message, filepath, [game, name]) => {
  game = message.mentions.roles.first()
  if (!game) {
    return message.reply(`Please specify a game to add the IGN for. It needs to be a pre-created role.`)
  }
  if (!name) {
    return message.reply(`Please specify an IGN for the game **${game}**`)
  }

  let data = JSON.parse(fs.readFileSync(`${filepath}${message.guild.id}.json`, 'utf8'))
  const gameObj = {
    gameID: game.id, name
  }
  const userObj = {
    id: message.author.id,
    games: [gameObj]
  }

  if (data.ign.length > 0) {
    for (let i in data.ign) {
      if (data.ign[i].id === message.author.id) {
        for (let j in data.ign[i].games) {
          if (data.ign[i].games[j].gameID === game.id) {
            data.ign[i].games[j] = gameObj
          } else {
            data.ign[i].games.push(gameObj)
          }
          break
        }
      } else {
        data.ign.push(userObj)
      }
      break
    }
  } else {
    data.ign.push(userObj)
  }
  fs.writeFile(`${filepath}${message.guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`Your IGN **${name}** for the game **${game}** was successfully updated.`)
  })
}
