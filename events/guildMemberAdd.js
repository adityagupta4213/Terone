const fs = require('fs')
const _colors = require('../colors.json')
const config = require('../config.json')
const staff = config.staff
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
exports.run = (bot, member) => {
  const guildID = member.guild.id
  const data = JSON.parse(fs.readFileSync(`./data/${guildID}.json`, 'utf8'))

  if (data.autoroleID) {
    member.setRoles([data.autoroleID])
  }

  // If server log is enabled
  if (data.serverlog) {
    member.guild.channels.find('name', 'server-log').send({
      embed: {
        color: colors.blue,
        description: `${member.user.username} has joined the server`,
        thumbnail: {
          url: member.user.avatarURL
        },
        author: {
          name: 'MEMBER JOINED'
        }
      }
    })
  }

  // Only if autowelcome is enabled
  if (data.autowelcome) {
    const welcomeChannel = data.welcomechannel
    let count = member.guild.memberCount
    // Get the last digit separated and +1 the count since the actual member count gets incremented by 1 when a new member joins
    count = count.toString().split('')
    count = count[count.length - 1]
    count = parseInt(count)
    count += 1
    console.log(count)
    // Determine the superscript for the member count
    let superscript
    switch (count) {
    case 1:
      superscript = 'st'
      break
    case 2:
      superscript = 'nd'
      break
    case 3:
      superscript = 'rd'
      break
    default:
      superscript = 'th'
      break
    }

    try {
      member.guild.channels.find('name', welcomeChannel).send({
        embed: {
          color: colors.blue,
          description: `**Welcome** ${member.user}! You are the ${member.guild.memberCount + 1}${superscript} member!`,
          thumbnail: {
            url: member.user.avatarURL
          },
          author: {
            name: 'WELCOME'
          }
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  }

  // Check if member is a Terone official
  for (let i in staff) {
    if (member.id === staff[i].userID) {
      welcomeOfficial(member)
    }
  }

  function welcomeOfficial(official) {
    let role
    // Find the staff official's role
    for (let i in staff) {
      if (staff[i].userID === official.user.id) {
        role = staff[i].role
      }
    }
    official.guild.channels.find('name', 'general').send({
      embed: {
        color: colors.blue,
        description: `An official support staff has joined the server`,
        author: {
          name: 'SUPPORT STAFF JOINED'
        },
        thumbnail: {
          url: official.user.avatarURL
        },
        fields: [{
          'name': 'Name',
          'value': `${official.user.username}`
        }, {
          'name': 'Role',
          'value': `${role}`
        }]
      }
    })
  }
}
