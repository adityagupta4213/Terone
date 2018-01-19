const fs = require('fs')

exports.run = (bot, message, filepath, [args]) => {
  const guild = message.guild
  let role = message.mentions.roles.first()
  let data = JSON.parse(fs.readFileSync(`${filepath}${guild.id}.json`, 'utf8'))
  if (!role) { return message.reply(`Please specify an existing role to automatically assign it to new members. For more info, use the help command\n \`\`\`${data.prefix}help autorole\`\`\``) }

  data.autoroleID = role.id

  fs.writeFile(`${filepath}${guild.id}.json`, JSON.stringify(data), err => {
    if (!err) message.reply(`**Automatic Role** was successfully set to **${role.name}**`)
  })
}
