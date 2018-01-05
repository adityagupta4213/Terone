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
  if (game !== 'all') {
    game = message.mentions.roles.first()
  }
  if (!game && game !== 'all') {
    return message.reply(`Please specify a game to show the IGN for. It needs to be a pre-created role. To display all your IGNs, use the following command \`\`\`${config.prefix}ign show all\`\`\``)
  }

  let data = JSON.parse(fs.readFileSync(`${filepath}${message.guild.id}.json`, 'utf8'))

  if (game !== 'all') {
    const errMsg = `Your IGN for the game ${game} does not exist. Use the following command to add it \`\`\`${config.prefix}ign add @gameRole yourIGN\`\`\``
    let gameFound = true
    if (data.ign.length > 0) {
      for (let i in data.ign) {
        if (data.ign[i].id === message.author.id) {
          for (let j in data.ign[i].games) {
            if (data.ign[i].games[j].gameID === game.id) {
              return message.reply(`Your IGN for the game ${game} is: **${data.ign[i].games[j].name}**`)
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
  } else {
    let fields = []
    for (let i in data.ign) {
      if (data.ign[i].id === message.author.id) {
        for (let j in data.ign[i].games) {
          let _games = data.ign[i].games
          let gameRole = message.guild.roles.find('id', _games[j].gameID)
          fields.push({
            name: `${parseInt(j) + parseInt(1)}. ${gameRole.name}`,
            value: `${_games[j].name}`
          })
        }
      }
    }
    if (data.ign.length < 1 || fields.length < 1) {
      return message.reply(`You haven't stored any IGNs.`)
    }
    message.channel.send({
      embed: {
        color: colors.blue,
        description: `Here are your IGNs ${message.author.username}\n`,
        author: {
          name: `IGN`
        },
        fields: fields
      }
    })
  }
}
