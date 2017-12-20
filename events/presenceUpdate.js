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
  let memberLog
  try {
    let settings
    try {
      settings = JSON.parse(fs.readFileSync(`./data/${newMember.guild.id}.json`, 'utf8'))
    }    catch (e) {
      console.log(e)
    }
    memberLog = settings.memberlog
  }  catch (e) {
    console.log(e)
  }
  if (memberLog !== 'false') {
    // User status updates
    /*if (oldMember.presence.status !== newMember.presence.status) {
      const statusColors = {
        online: colors.green,
        offline: colors.grey,
        idle: colors.yellow,
        dnd: colors.red
      }
      let color = statusColors[newMember.presence.status]

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
        console.log(e)
      }
    } */
    // User game updates
    if (oldMember.presence.game !== newMember.presence.game) {
      if (newMember.presence.game) {
        try {
          newMember.guild.channels.find('name', 'member-log').send({
            embed: {
              color: colors.blue,
              description: `**${newMember.user.username}** is now playing ${newMember.presence.game.name}`,
              thumbnail: {
                url: newMember.user.avatarURL
              },
              author: {
                name: `STATUS UPDATE`
              }
            }
          })
        }        catch (e) {
          console.log(e)
        }
      }
    }
    // User username change updates
    if (oldMember.nickname !== newMember.nickname) {
      try {
        newMember.guild.channels.find('name', 'member-log').send({
          embed: {
            color: colors.blue,
            description: `**${oldMember.nickname}** has changed their nickname to ${newMember.nickname}`,
            thumbnail: {
              url: newMember.user.avatarURL
            },
            author: {
              name: `STATUS UPDATE`
            }
          }
        })
      }      catch (e) {
        console.log(e)
      }
    }

    // User avatar change updates
    if (oldMember.user.avatar !== newMember.user.avatar) {
      try {
        newMember.guild.channels.find('name', 'member-log').send({
          embed: {
            color: colors.blue,
            description: `**${oldMember.user.username}** has changed their avatar`,
            image: {
              url: newMember.user.avatarURL
            },
            author: {
              name: `STATUS UPDATE`
            }
          }
        })
      }      catch (e) {
        console.log(e)
      }
    }
  }
}
