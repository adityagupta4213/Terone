
const Hirez = require('hirez.js')
const config = require('../config.json')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

let hirez = new Hirez({
  devId: config.paladinsDevID,
  authKey: config.paladinsAuthKey
})
let generatedSession = null
exports.run = (bot, message, ign) => {
  if (!ign) {
    return message.reply('Provide a player\'s in-game name')
  }

  if (!generatedSession) {
    let session
    hirez.paladins('pc').session.generate().then(_session => {
      session = _session
    }).catch(e => {
      console.log(e)
      message.reply(e)
    })
    generatedSession = session

    setTimeout(() => {
      generatedSession = null
    }, 15 * 60 * 1000)
  }

  fetchAndSend(bot, message, ign)
}

function fetchAndSend (bot, message, ign) {
  hirez.paladins('pc').getPlayer(ign).then(player => {
    hirez.paladins('pc').getPlayerStatus(ign).then(playerStatus => {
      hirez.paladins('pc').getChampionRanks(ign).then(championRanks => {
        player = player[0]
        playerStatus = playerStatus[0]
        championRanks = championRanks[0]
        sendData(message, player, playerStatus, championRanks)
      })
    })
  })

  function sendData (message, player, playerStatus, championRanks) {
    message.channel.send({
      embed: {
        color: colors.blue,
        author: {
          name: player.Name
        },
        description: playerStatus.status_string.toLowerCase().includes('offline') ? `${playerStatus.status_string} - Last Seen: ${new Date(Date.parse(player.Last_Login_Datetime))}` : playerStatus.status_string,
        fields: [
          {
            'name': 'Joined',
            'value': `${new Date(Date.parse(player.Created_Datetime))}`
          },
          {
            'name': 'Level',
            'value': `${player.Level}`,
            'inline': true
          },
          {
            'name': 'Mastery Level',
            'value': `${player.MasteryLevel}`,
            'inline': true
          },
          {
            'name': 'Total Achievements',
            'value': `${player.Total_Achievements}`,
            'inline': true
          },
          {
            'name': 'Victories',
            'value': `${player.Wins}`,
            'inline': true
          },
          {
            'name': 'Losses',
            'value': `${player.Losses}`,
            'inline': true
          },
          {
            'name': 'Leaves',
            'value': `${player.Leaves}`,
            'inline': true
          },
          {
            name: 'Most Played',
            value: `${championRanks.champion} - Level ${championRanks.Rank}\n` +
            `${championRanks.Kills} Kills, ${championRanks.Deaths} Deaths and ${championRanks.Assists} Assists (${(championRanks.Kills / championRanks.Deaths).toFixed(2)} K/D)\n` +
            `${championRanks.Wins} Wins and ${championRanks.Losses} Losses (${(championRanks.Wins / (championRanks.Wins + championRanks.Losses) * 100).toFixed(2)} Win %)`,
            inline: true
          }
        ]
      }
    })
  }
}
