const colors = require('../colors.json')

exports.run = (bot, message, member) => {
  try {
    member.guild.channels.find('name', 'member-log').send({
      embed: {
        color: colors.red,
        description: `${member.user} has left the server`,
        author: {
          name: 'MEMBER LEFT'
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}
