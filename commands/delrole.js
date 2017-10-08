const _colors = require('../colors.json')
// Change string values to int from colors.json
const colors = {}
Object.keys(_colors).forEach(function (key) {
  let value = _colors[key]
  colors[key] = parseInt(value)
})

exports.run = (bot, message) => {
  // IF the member has required permissions
  if (!message.member.hasPermission(['MANAGE_ROLES'])) {
    return message.channel.send(`${message.author} Trying to be sneaky eh? **You don't have the required permissions to manage roles!**`)
  }

  let role = message.mentions.roles.first()
  if (!role) { return message.reply('You need to mention a valid role') }
  let roleName = role.name
  if (!role) {
    return message.reply('Please mention a valid role of this server mate!')
  }
  if (!role.editable) {
    return message.reply('I cannot remove this role! Do I have the permissions?')
  }

  try {
    role.delete()
    message.guild.channels.find('name', 'server-log').send({
      embed: {
        color: colors.red,
        description: `Role **${roleName}** deleted by ${message.author}`,
        author: {
          name: 'ROLE DELETED'
        }
      }
    })
  } catch (e) {
    message.reply(`Couldn't delete role ${roleName} due to: ${e}`)
  }
}
