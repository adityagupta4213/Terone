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
    let gameFound = true
    let userFound = true
    for (let i = 0; i < data.ign.length; i++) {
      let user = data.ign[i]
      if (user.id === message.author.id && user.games.length > 0) {
        userFound = true
        for (let j = 0; j < user.games.length; j++) {
          let currentGame = user.games[j]
          if (currentGame.gameID === game.id) {
            gameFound = true
            currentGame.gameID = game.id
            currentGame['name'] = name
            break
          } else {
            gameFound = false
          }
        }
        if (!gameFound) {
          user.games.push(gameObj)
        }
      } else {
        userFound = false
      }
    }
    if (!userFound) {
      data.ign.push(userObj)
    }
  } else {
    data.ign.push(userObj)
  }
  fs.writeFile(`${filepath}${message.guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`Your IGN **${name}** for the game **${game}** was successfully updated.`)
  })
}
