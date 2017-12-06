const fs = require('fs')
const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})
exports.run = (bot, member) => {
  console.log(member.guild)
  const guildID = member.guild.id
  const data = JSON.parse(fs.readFileSync(`./data/${guildID}.json`, 'utf8'))
  // If server log is disabled, don't do anything
  if (data.serverlog === 'false') return
  try {
    member.guild.channels.find('name', 'server-log').send({
      embed: {
        color: colors.red,
        description: `${member.user.name} has left the server`,
        author: {
          name: 'MEMBER LEFT'
        }
      }
    })
  }
  catch (e) {
    console.log(e)
  }
}
