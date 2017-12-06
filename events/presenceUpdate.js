//
// Greet users when they come online or go offline and member-log
//

const fs = require('fs')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, oldMember, newMember) => {
  if (oldMember.presence.status !== newMember.presence.status) {
    const statusColors = {
      online: colors.green,
      offline: colors.grey,
      idle: colors.yellow,
      dnd: colors.red
    }
    let color = statusColors[newMember.presence.status]
    try {
      let settings
      try {
        settings = JSON.parse(fs.readFileSync(`./data/${newMember.guild.id}.json`, 'utf8'))
      }
      catch (e) {
        console.log(e)
      }

      const memberLog = settings.memberlog
      if (memberLog !== 'false') {
        try {
          newMember.guild.channels.find('name', 'member-log').send({
            embed: {
              color: color,
              description: `**${newMember.user.username}** is now ${newMember.presence.status}`,
              thumbnail: {
                url: newMember.user.avatarURL
              },
              author: {
                name: `MEMBER ${newMember.presence.status.toUpperCase()}`
              }
            }
          })
        }
        catch (e) {
          console.log('.')
        }
      }
    }
    catch (e) {
      console.log(e)
    }
  }
}
