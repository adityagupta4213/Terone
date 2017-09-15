//
// Server join log and greeting
//
const colors = require('../colors.json')
const config = require('../config.json')
const staff = config.staff

exports.run = (bot, member) => {
  for (let i in staff) {
    if (member.id === staff[i].userID) {
      welcomeOfficial(member)
    }
  }
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
    case 1: superscript = 'st'
      break
    case 2: superscript = 'nd'
      break
    case 3: superscript = 'rd'
      break
    default: superscript = 'th'
      break
  }

  try {
    member.guild.channels.find('name', 'welcome').send({
      embed: {
        color: colors.blue,
        description: `**Welcome** ${member.user} !You are the ${member.guild.memberCount + 1}${superscript} member!`,
        thumbnail: {
          url: member.user.avatarURL
        },
        author: {
          name: 'WELCOME'
        }
      }
    })
    member.guild.channels.find('name', 'member-log').send({
      embed: {
        color: colors.blue,
        description: `${member.user} has joined the server`,
        thumbnail: {
          url: bot.user.avatarURL
        },
        author: {
          name: 'MEMBER JOINED'
        }
      }
    })
  } catch (e) {
    console.log(e)
  }

  function welcomeOfficial (official) {
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
        fields: [
          {
            'name': 'Name',
            'value': `${official.user.username}`
          },
          {
            'name': 'Role',
            'value': `${role}`
          }
        ]
      }
    })
  }
}
