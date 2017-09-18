const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
exports.run = (bot, member) => {
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
