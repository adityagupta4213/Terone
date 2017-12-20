const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message, [name, color]) => {
  // IF the member has required permissions
  if (!message.member.hasPermission(['MANAGE_ROLES'])) {
    return message.channel.send(`${message.author} Trying to be sneaky eh? **You don't have the required permissions to manage roles!`)
  }
  if (!name) {
    return message.reply('**Please enter a valid role name**')
  }
  if (!color) {
    color = 'DEFAULT'
  }
  else if (color) {
    color.toUpperCase()
  }
  message.guild.createRole({
      name,
      color,
      mentionable: true
    })
    .then(() => {
      message.guild.channels.find('name', 'server-log').send({
        embed: {
          color: colors.blue,
          description: `Role **${name}** created by ${message.author}`,
          author: {
            name: 'ROLE CREATED'
          }
        }
      })
    })
    .catch((e) => message.channel.send(e))
}
