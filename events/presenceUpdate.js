//
// Greet users when they come online or go offline and member-log
//
const colors = require('../colors.json')

exports.run = (bot, oldMember, newMember) => {
  if (oldMember.presence.status !== newMember.presence.status) {
    if (newMember.presence.status === 'online') {
      // Greeting users in the General channel has been disabled untill it is a part of settings
      /* let index = Math.floor(Math.random() * 3)
      // So that each instance sends message to its own server instead of every server
      try {
      newMember.guild.channels.find('name', 'general').send(`${greetings[index]} ${newMember.user}. Welcome back :raising_hand:`)
      }
      catch (e) {
      console.log(e)
      } */
    }
    const statusColors = {
      online: parseInt(colors.green),
      offline: parseInt(colors.grey),
      idle: parseInt(colors.yellow),
      dnd: parseInt(colors.red)
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
    } catch (e) {
      console.log(e)
    }
  }
}
